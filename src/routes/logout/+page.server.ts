import { authService } from "$lib/server/app"
import type { PageServerLoad } from "./$types"
import { fail, redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.session) {
		return fail(401)
	}

	const blankSessionCookie = await authService.invalidateSession(locals.session.id)
	cookies.set(blankSessionCookie.name, blankSessionCookie.value, {
		path: ".",
		...blankSessionCookie.attributes
	})

	redirect(302, "/")
}
