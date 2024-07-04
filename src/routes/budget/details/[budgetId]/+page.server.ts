import { BudgetService } from "$lib/server/services/budgetService"
import { TransactionService } from "$lib/server/services/transactionService"
import type { PageServerLoad } from "./$types"
import { error, redirect } from "@sveltejs/kit"

const budgetService = new BudgetService()
const transactionService = new TransactionService()

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = locals

	if (!user) redirect(302, "/login")

	const budget = await budgetService.getBudgetById(params.budgetId)

	if (!budget || budget.userId !== user.id) error(404, "Budget not found")

	const transactions = await transactionService.getTransactionsByBudgetId(params.budgetId)

	return {
		budget,
		transactions
	}
}
