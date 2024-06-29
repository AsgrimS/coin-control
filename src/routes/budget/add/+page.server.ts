import { createBudgetSchema } from "$lib/forms"
import { BudgetService } from "$lib/server/services/budgetService"
import type { Actions, PageServerLoad } from "./$types"
import { fail, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { typebox } from "sveltekit-superforms/adapters"

const budgetService = new BudgetService()

export const load: PageServerLoad = async () => {
	const form = await superValidate(typebox(createBudgetSchema))

	return { form }
}

export const actions: Actions = {
	default: async (event) => {
		const currentUser = event.locals.user
		if (!currentUser) redirect(302, "/login")

		const form = await superValidate(event.request, typebox(createBudgetSchema))
		if (!form.valid) return fail(400, { form })

		const { amount, resetFrequency } = form.data

		const isBudgetCreated = await budgetService.createBudget({
			userId: currentUser.id,
			amount,
			resetFrequency
		})

		if (!isBudgetCreated) {
			return fail(400, { form })
		}

		redirect(302, "/")
	}
}
