import { loginSchema } from "$lib/forms"
import { lucia } from "$lib/server/auth"
import { getLimiter } from "$lib/server/limiter"
import { AuthService } from "$lib/server/services/authService"
import { UserService } from "$lib/server/services/userService"
import type { Actions, PageServerLoad } from "./$types"
import { fail, redirect, error } from "@sveltejs/kit"
import { setError, superValidate } from "sveltekit-superforms"
import { typebox } from "sveltekit-superforms/adapters"

const limiter = getLimiter("login")
const userService = new UserService()
const authService = new AuthService()

export const load: PageServerLoad = async (event) => {
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
		const user = await userService.getUserByUsername(username)

		if (!user) {
			// This is to prevent timing attacks
			authService.hashPassword(password)
			return setError(form, "password", incorrectCredentialsMessage)
		}

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
