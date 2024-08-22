import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = ({ locals, params }) => {
	return {
		user: locals.user,
		budgetId: params.budgetId || null
	}
}
