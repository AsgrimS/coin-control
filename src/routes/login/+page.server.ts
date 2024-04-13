import { lucia } from '$lib/server/auth';
import { fail, redirect, error } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';

import type { Actions, PageServerLoad } from './$types';
import { db, userTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { getLimiter } from '$lib/server/limiter';

const limiter = getLimiter('login');

export const load: PageServerLoad = async (event) => {
	await limiter.cookieLimiter?.preflight(event);
};

export const actions: Actions = {
	default: async (event) => {
		if (await limiter.isLimited(event)) error(429);

		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.username, username.toLowerCase()));

		if (!existingUser) {
			// This is to prevent timing attacks
			new Argon2id().hash(password);
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const validPassword = await new Argon2id().verify(existingUser.hashed_password ?? '', password);
		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
