import { BudgetService } from "$lib/server/services/budgetService"
import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"

const budgetService = new BudgetService()

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = locals

	if (!user) redirect(302, "/login")

	const budget = await budgetService.getBudgetById(params.budgetId)

	if (!budget) redirect(302, "/404")
	if (budget.userId !== user.id) redirect(302, "/403")

	return {
		budget
	}
}
