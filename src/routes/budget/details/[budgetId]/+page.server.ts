import { getTrimmedOrNull } from "$lib/common"
import { createTransactionSchema, deleteTransactionSchema } from "$lib/forms"
import { BudgetService } from "$lib/server/services/budgetService"
import { TransactionService } from "$lib/server/services/transactionService"
import type { Actions, PageServerLoad } from "./$types"
import { fail, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { typebox } from "sveltekit-superforms/adapters"

const budgetService = new BudgetService()
const transactionService = new TransactionService()

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = locals

	if (!user) redirect(302, "/login")

	const budget = await budgetService.getBudgetById(params.budgetId)

	if (!budget || budget.userId !== user.id) redirect(302, "/")

	const transactions = await transactionService.getTransactionsByBudgetId(params.budgetId)

	const createTransactionForm = await superValidate(typebox(createTransactionSchema))
	const removeTransactionForm = await superValidate(typebox(deleteTransactionSchema))

	return {
		createTransactionForm,
		removeTransactionForm,
		budget,
		transactions
	}
}

export const actions: Actions = {
	createTransaction: async ({ params, locals, request }) => {
		const currentUser = locals.user
		if (!currentUser) redirect(302, "/login")

		const form = await superValidate(request, typebox(createTransactionSchema))
		if (!form.valid) return fail(400, { form })

		const { amount, title } = form.data

		const isTransactionCreated = await transactionService.createTransaction({
			userId: currentUser.id,
			budgetId: params.budgetId,
			amount,
			title: getTrimmedOrNull(title)
		})

		if (!isTransactionCreated) {
			return fail(400, { form })
		}
	},

	deleteTransaction: async ({ locals, request }) => {
		const currentUser = locals.user
		if (!currentUser) redirect(302, "/login")

		const form = await superValidate(request, typebox(deleteTransactionSchema))
		const { transactionId } = form.data

		const isTransactionDeleted = await transactionService.deleteTransaction(transactionId)

		if (!isTransactionDeleted) {
			return fail(400, { form })
		}
	}
}
