import { createTransactionSchema } from "$lib/forms"
import { BudgetService } from "$lib/server/services/budgetService"
import { TransactionService } from "$lib/server/services/transactionService"
import type { Actions, PageServerLoad } from "./$types"
import { error, fail, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { typebox } from "sveltekit-superforms/adapters"

const budgetService = new BudgetService()
const transactionService = new TransactionService()

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = locals

	if (!user) redirect(302, "/login")

	const budget = await budgetService.getBudgetById(params.budgetId)

	if (!budget || budget.userId !== user.id) error(404, "Budget not found")

	const transactions = await transactionService.getTransactionsByBudgetId(params.budgetId)
	const form = await superValidate(typebox(createTransactionSchema))

	return {
		form,
		budget,
		transactions
	}
}

export const actions: Actions = {
	default: async ({ params, locals, request }) => {
		const currentUser = locals.user
		if (!currentUser) redirect(302, "/login")

		const form = await superValidate(request, typebox(createTransactionSchema))
		if (!form.valid) return fail(400, { form })

		const { amount } = form.data

		const isTransactionCreated = await transactionService.createTransaction({
			userId: currentUser.id,
			budgetId: params.budgetId,
			amount
		})

		if (!isTransactionCreated) {
			return fail(400, { form })
		}
	}
}
