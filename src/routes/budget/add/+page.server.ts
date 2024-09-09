import { createBudgetSchema } from "$lib/forms"
import { createBudgetCommand } from "$lib/server/app"
import type { Actions, PageServerLoad } from "./$types"
import { fail, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { typebox } from "sveltekit-superforms/adapters"

export const load: PageServerLoad = async ({ locals }) => {
	const currentUser = locals.user
	if (!currentUser) redirect(302, "/login")

	const form = await superValidate(typebox(createBudgetSchema))

	return { form }
}

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const currentUser = locals.user
		if (!currentUser) redirect(302, "/login")

		const form = await superValidate(request, typebox(createBudgetSchema))
		if (!form.valid) return fail(400, { form })

		const { amount, resetFrequency, name } = form.data

		const result = await createBudgetCommand.execute({
			ownerId: currentUser.id,
			name,
			resetFrequency,
			allowance: amount
		})

		if (result.ok === false) {
			return fail(400, { form })
		}

		redirect(302, "/")
	}
}
