import type { BudgetDto } from "$lib/dtos/budget"
import { BudgetService } from "$lib/server/services/budgetService"
import type { PageServerLoad } from "./$types"

const budgetService = new BudgetService()

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user
	let budgets: BudgetDto[] = []

	if (user !== null) {
		budgets = await budgetService.getBudgetsByUserId(user.id)
	}

	return {
		budgets
	}
}
