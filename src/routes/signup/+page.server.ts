import { lucia } from '$lib/server/auth';
import { error, fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

import { superValidate, setError } from 'sveltekit-superforms';
import { typebox } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { db, userTable } from '$lib/server/schema';
import { getLimiter } from '$lib/server/limiter';
import { signUpSchema } from '$lib/forms';
import { eq } from 'drizzle-orm';

const limiter = getLimiter('signup', [5, 'm']);

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(typebox(signUpSchema));
	await limiter.cookieLimiter?.preflight(event);

	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, typebox(signUpSchema));
		if (!form.valid) return fail(400, { form });
		if (await limiter.isLimited(event)) error(429);

		const { username, password, repeatPassword } = form.data;

		if (password !== repeatPassword) {
			const errorMessage = 'Passwords do not match';
			setError(form, 'repeatPassword', errorMessage);
			setError(form, 'password', errorMessage);
			return fail(400, { form });
		}

		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(password);

		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.username, username.toLowerCase()));

		if (existingUser) return setError(form, 'username', 'This username is already taken');

		await db.insert(userTable).values({
			id: userId,
			username: username,
			hashed_password: hashedPassword
		});

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
