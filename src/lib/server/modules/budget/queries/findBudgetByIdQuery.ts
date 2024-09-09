import type { BudgetDTO } from "$lib/dtos/budget"
import { TYPES } from "$lib/server/dependencyInjection/types"
import type { IQuery } from "$lib/server/shared/query"
import { err, ok, type Result } from "$lib/server/shared/results"
import type { IUserRepository } from "../../user/infrastructure/userRepositoryPort"
import type { IBudgetRepository } from "../infrastructure/budgetRepositoryPort"
import { inject, injectable } from "inversify"

export type FindBudgetByIdQueryPayload = {
	budgetId: string
	userId: string
}

@injectable()
export class FindBudgetByIdQuery implements IQuery<FindBudgetByIdQueryPayload, BudgetDTO> {
	@inject(TYPES.BudgetRepository) private readonly budgetRepository: IBudgetRepository
	@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository

	async query({
		budgetId,
		userId
	}: FindBudgetByIdQueryPayload): Promise<Result<BudgetDTO, string>> {
		const budget = await this.budgetRepository.findOneById(budgetId)
		if (!budget) return err("Budget not found")

		const user = await this.userRepository.findOneById(userId)
		if (!user) return err("User performing the query does not exist")

		if (!budget.canBeAccessedBy(user)) return err("User does not have access to this budget")

		return ok({
			id: budget.Id,
			ownerId: budget.OwnerId,
			allowance: budget.Allowance.Value,
			name: budget.Name.Value,
			resetFrequency: budget.ResetFrequency.Value,
			nextReset: budget.NextResetDate.Value
		})
	}
}
