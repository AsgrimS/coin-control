import { UserAlreadyExistsError } from "$lib/errors"
import { signUpSchema } from "$lib/forms"
import { lucia } from "$lib/server/auth"
import { getLimiter } from "$lib/server/limiter"
import { AuthService } from "$lib/server/services/authService"
import { UserService } from "$lib/server/services/userService"
import type { Actions, PageServerLoad } from "./$types"
import { error, fail, redirect } from "@sveltejs/kit"
import { superValidate, setError } from "sveltekit-superforms"
import { typebox } from "sveltekit-superforms/adapters"

const limiter = getLimiter("signup", [5, "m"])
const userService = new UserService()
const authService = new AuthService()

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(typebox(signUpSchema))
	await limiter.cookieLimiter?.preflight(event)

	return { form }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, typebox(signUpSchema))
		if (!form.valid) return fail(400, { form })
		if (await limiter.isLimited(event)) error(429)

		const { username, password, repeatPassword } = form.data

		if (password !== repeatPassword) {
			const passwordsMismatchMessage = "Passwords do not match"
			setError(form, "repeatPassword", passwordsMismatchMessage)
			setError(form, "password", passwordsMismatchMessage)
			return fail(400, { form })
		}

		const id = authService.generateUserId()
		const hashedPassword = await authService.hashPassword(password)

		const userCreateResult = await userService.createUser({
			id,
			username,
			hashedPassword
		})

		if (userCreateResult instanceof UserAlreadyExistsError) {
			setError(form, "username", "This username is already taken")
			return fail(400, { form })
		}

		const session = await lucia.createSession(id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		})

		redirect(302, "/")
	}
}
