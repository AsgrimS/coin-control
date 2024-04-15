import { lucia } from "$lib/server/auth"
import type { PageServerLoad } from "./$types"
import { fail, redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.session) {
		return fail(401)
	}

	await lucia.invalidateSession(locals.session.id)
	const sessionCookie = lucia.createBlankSessionCookie()
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: ".",
		...sessionCookie.attributes
	})

	redirect(302, "/")
}
