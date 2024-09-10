import type { CreateTransactionDTO } from "$lib/dtos/transaction"
import { TYPES } from "$lib/server/dependencies/types"
import type { ICommand } from "$lib/server/shared/command"
import { err, ok, type Result } from "$lib/server/shared/results"
import { getRandomId } from "$lib/server/utils"
import { TransactionVO } from "../domain/value-objects/transaction"
import type { IBudgetRepository } from "../infrastructure/budgetRepositoryPort"
import { inject, injectable } from "inversify"

@injectable()
export class AddTransactionToBudgetCommand implements ICommand<CreateTransactionDTO> {
	@inject(TYPES.BudgetRepository) private readonly budgetRepository: IBudgetRepository

	async execute(payload: CreateTransactionDTO): Promise<Result<void, string>> {
		const budget = await this.budgetRepository.findOneById(payload.budgetId)
		if (!budget) return err("Budget not found")

		const transactionResult = TransactionVO.from({
			id: getRandomId(),
			budgetId: budget.Id,
			amount: payload.amount,
			createdAt: new Date(),
			title: payload.title
		})
		if (transactionResult.ok === false) return err(transactionResult.error.message)

		budget.addExpense(transactionResult.data)
		await this.budgetRepository.update(budget)

		return ok()
	}
}
