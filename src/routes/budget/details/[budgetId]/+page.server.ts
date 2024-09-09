import { createTransactionSchema, deleteTransactionSchema } from "$lib/forms"
import {
	addTransactionToBudgetCommand,
	findBudgetByIdQuery,
	removeTransactionFromBudgetCommand
} from "$lib/server/app"
import type { Actions, PageServerLoad } from "./$types"
import { fail, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { typebox } from "sveltekit-superforms/adapters"

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

	const createTransactionForm = await superValidate(typebox(createTransactionSchema))
	const removeTransactionForm = await superValidate(typebox(deleteTransactionSchema))

	return {
		createTransactionForm,
		removeTransactionForm,
		budget
	}
}

export const actions: Actions = {
	createTransaction: async ({ params, locals, request }) => {
		const currentUser = locals.user
		if (!currentUser) redirect(302, "/login")

		const form = await superValidate(request, typebox(createTransactionSchema))
		if (!form.valid) return fail(400, { form })

		const { amount, title } = form.data

		const result = await addTransactionToBudgetCommand.execute({
			title,
			amount,
			budgetId: params.budgetId
		})

		if (result.ok === false) {
			return fail(400, { form })
		}
	},

	deleteTransaction: async ({ params, locals, request }) => {
		const currentUser = locals.user
		if (!currentUser) redirect(302, "/login")

		const form = await superValidate(request, typebox(deleteTransactionSchema))
		const { transactionId } = form.data

		const result = await removeTransactionFromBudgetCommand.execute({
			budgetId: params.budgetId,
			transactionId
		})

		if (result.ok === false) {
			return fail(400, { form })
		}
	}
}
