import { lucia } from '$lib/server/auth';
import { fail, redirect, error } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';

import type { Actions, PageServerLoad } from './$types';
import { db, userTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { getLimiter } from '$lib/server/limiter';
import { setError, superValidate } from 'sveltekit-superforms';
import { typebox } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/forms';

const limiter = getLimiter('login');

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(typebox(loginSchema));
	await limiter.cookieLimiter?.preflight(event);

	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, typebox(loginSchema));
		if (!form.valid) return fail(400, { form });
		if (await limiter.isLimited(event)) error(429);

		const { username, password } = form.data;

		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.username, username.toLowerCase()));

		if (!existingUser) {
			// This is to prevent timing attacks
			new Argon2id().hash(password);
			return setError(form, 'password', 'Incorrect username or password');
		}

		const validPassword = await new Argon2id().verify(existingUser.hashed_password ?? '', password);
		if (!validPassword) return setError(form, 'password', 'Incorrect username or password');

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
