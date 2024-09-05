import type { UserDTO } from "$lib/dtos/user"
import { loginSchema } from "$lib/forms"
import { lucia } from "$lib/server/auth"
import { appContainer } from "$lib/server/dependencyInjection/inversify.config"
import { TYPES } from "$lib/server/dependencyInjection/types"
import { getLimiter } from "$lib/server/limiter"
import { AuthService } from "$lib/server/services/authService"
import type { IQuery } from "$lib/server/shared/query"
import type { Actions, PageServerLoad } from "./$types"
import { fail, redirect, error } from "@sveltejs/kit"
import { setError, superValidate } from "sveltekit-superforms"
import { typebox } from "sveltekit-superforms/adapters"

const limiter = getLimiter("login")
const authService = new AuthService()
const findUserByUsernameQuery = appContainer.get<IQuery<string, UserDTO>>(
	TYPES.FindUserByUsernameQuery
)

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, "/")

	const form = await superValidate(typebox(loginSchema))
	await limiter.cookieLimiter?.preflight(event)

	return { form }
}

export const actions: Actions = {
	default: async (event) => {
		const incorrectCredentialsMessage = "Incorrect username or password"
		const form = await superValidate(event.request, typebox(loginSchema))

		if (!form.valid) return fail(400, { form })
		if (await limiter.isLimited(event)) error(429)

		const { username, password } = form.data
		const result = await findUserByUsernameQuery.query(username)

		if (result.ok === false) {
			// This is to prevent timing attacks
			authService.hashPassword(password)
			return setError(form, "password", incorrectCredentialsMessage)
		}

		const user = result.data

		const isPasswordValid = await authService.verifyPassword(user.hashedPassword, password)
		if (!isPasswordValid) return setError(form, "password", incorrectCredentialsMessage)

		const session = await lucia.createSession(user.id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		})

		redirect(302, "/")
	}
}
