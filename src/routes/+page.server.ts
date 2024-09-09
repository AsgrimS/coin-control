import { findBudgetsByOwnerIdQuery } from "$lib/server/app"
import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user

	if (!user) redirect(302, "/login")

	const queryResult = await findBudgetsByOwnerIdQuery.query(user.id)
	if (queryResult.ok === false) redirect(302, "/offline")

	const budgets = queryResult.data

	if (budgets.length === 1) {
		redirect(302, `/budget/details/${budgets[0].id}`)
	}

	return {
		budgets
	}
}
