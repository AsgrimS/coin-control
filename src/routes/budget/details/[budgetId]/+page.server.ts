import { getTrimmedOrNull } from "$lib/common"
import { createTransactionSchema, deleteTransactionSchema } from "$lib/forms"
import { findBudgetByIdQuery } from "$lib/server/app"
import { TransactionService } from "$lib/server/services/transactionService"
import type { Actions, PageServerLoad } from "./$types"
import { fail, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { typebox } from "sveltekit-superforms/adapters"

const transactionService = new TransactionService()

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = locals

	if (!user) redirect(302, "/login")

	const budgetQuery = await findBudgetByIdQuery.query({
		budgetId: params.budgetId,
		userId: user.id
	})

	if (budgetQuery.ok === false) redirect(302, "/")
	const budget = budgetQuery.data

	const transactionsDateRange = new Date(budget.nextReset)
	if (budget.resetFrequency === "monthly") {
		transactionsDateRange.setMonth(transactionsDateRange.getMonth() - 1)
	} else if (budget.resetFrequency === "weekly") {
		transactionsDateRange.setDate(transactionsDateRange.getDate() - 7)
	}

	const transactions = await transactionService.getTransactionsByBudgetId({
		budgetId: params.budgetId,
		newerThanEqual: transactionsDateRange
	})

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
