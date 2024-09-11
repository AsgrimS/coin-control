import { signUpSchema } from "$lib/forms"
import { authService, createUserCommand } from "$lib/server/app"
import { getLimiter } from "$lib/server/limiter"
import type { Actions, PageServerLoad } from "./$types"
import { error, fail, redirect } from "@sveltejs/kit"
import { superValidate, setError } from "sveltekit-superforms"
import { typebox } from "sveltekit-superforms/adapters"

const limiter = getLimiter("signup", [5, "m"])

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

		const result = await createUserCommand.execute({
			id,
			username,
			hashedPassword
		})

		if (result.ok === false) {
			setError(form, "username", result.error)
			return fail(400, { form })
		}

		const sessionCookie = await authService.createSessionCookie(id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		})

		redirect(302, "/")
	}
}
