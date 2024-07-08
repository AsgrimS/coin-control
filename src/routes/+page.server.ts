import type { BudgetDto } from "$lib/dtos/budget"
import { BudgetService } from "$lib/server/services/budgetService"
import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"

const budgetService = new BudgetService()

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user
	let budgets: BudgetDto[] = []

	if (user !== null) {
		budgets = await budgetService.getBudgetsByUserId(user.id)
	}

	if (budgets.length === 1) {
		redirect(302, `/budget/details/${budgets[0].id}`)
	}

	return {
		budgets
	}
}
