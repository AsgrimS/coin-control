import type { CreateBudgetDTO } from "$lib/dtos/budget"
import { TYPES } from "$lib/server/dependencies/types"
import type { ICommand } from "$lib/server/shared/command"
import { err, ok, type Result } from "$lib/server/shared/results"
import { getRandomId } from "$lib/server/utils"
import type { IUserRepository } from "../../user/infrastructure/userRepositoryPort"
import { BudgetEntity } from "../domain/budgetEntity"
import { NextResetPolicy } from "../domain/policies/nextResetPolicy"
import { BudgetAllowanceVO } from "../domain/value-objects/budgetAllowance"
import { BudgetNameVO } from "../domain/value-objects/budgetName"
import { ResetFrequencyVO } from "../domain/value-objects/resetFrequency"
import type { IBudgetRepository } from "../infrastructure/budgetRepositoryPort"
import { inject, injectable } from "inversify"

@injectable()
export class CreateBudgetCommand implements ICommand<CreateBudgetDTO> {
	@inject(TYPES.BudgetRepository) private readonly budgetRepository: IBudgetRepository
	@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository

	async execute(payload: CreateBudgetDTO): Promise<Result<void, string>> {
		const user = await this.userRepository.findOneById(payload.ownerId)
		if (!user) return err("Could not find user wth specified ID to create budget for")

		const budgetAllowanceResult = BudgetAllowanceVO.from(payload.allowance)
		if (budgetAllowanceResult.ok === false) return err(budgetAllowanceResult.error.message)

		const budgetNameResult = BudgetNameVO.from(payload.name)
		if (budgetNameResult.ok === false) return err(budgetNameResult.error.message)

		const resetFrequencyResult = ResetFrequencyVO.from(payload.resetFrequency)
		if (resetFrequencyResult.ok === false) return err(resetFrequencyResult.error.message)

		const nextResetPolicy = NextResetPolicy.from(resetFrequencyResult.data)

		const budget = BudgetEntity.from({
			id: getRandomId(),
			ownerId: user.Id,
			allowance: budgetAllowanceResult.data,
			name: budgetNameResult.data,
			resetFrequency: resetFrequencyResult.data,
			nextResetDate: nextResetPolicy.getNextResetDate(),
			transactions: []
		})

		await this.budgetRepository.insert(budget)

		return ok()
	}
}
