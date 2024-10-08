import type { BudgetDTO } from "$lib/dtos/budget"
import { TYPES } from "$lib/server/dependencies/types"
import type { IQuery } from "$lib/server/shared/query"
import { ok, type Result } from "$lib/server/shared/results"
import type { IBudgetRepository } from "../infrastructure/budgetRepositoryPort"
import { inject, injectable } from "inversify"

@injectable()
export class FindBudgetsByOwnerIdQuery implements IQuery<string, BudgetDTO[]> {
	@inject(TYPES.BudgetRepository) private readonly budgetRepository: IBudgetRepository

	async query(onwerId: string): Promise<Result<BudgetDTO[], string>> {
		const budgets = await this.budgetRepository.findByOwnerId(onwerId)

		return ok(
			budgets.map((budget) => ({
				id: budget.Id,
				ownerId: budget.OwnerId,
				allowance: budget.Allowance.Value,
				name: budget.Name.Value,
				resetFrequency: budget.ResetFrequency.Value,
				nextReset: budget.NextResetDate.Value,
				transactions: budget.Transactions.map((t) => ({
					id: t.Value.id,
					amount: t.Value.amount,
					title: t.Value.title,
					createdAt: t.Value.createdAt
				}))
			}))
		)
	}
}
