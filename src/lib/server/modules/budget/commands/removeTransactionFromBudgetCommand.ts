import type { RemoveTransactionDTO } from "$lib/dtos/transaction"
import { TYPES } from "$lib/server/dependencyInjection/types"
import type { ICommand } from "$lib/server/shared/command"
import { err, ok, type Result } from "$lib/server/shared/results"
import type { IBudgetRepository } from "../infrastructure/budgetRepositoryPort"
import { inject, injectable } from "inversify"

@injectable()
export class RemoveTransactionFromBudgetCommand implements ICommand<RemoveTransactionDTO> {
	@inject(TYPES.BudgetRepository) private readonly budgetRepository: IBudgetRepository

	async execute(payload: RemoveTransactionDTO): Promise<Result<void, string>> {
		const budget = await this.budgetRepository.findOneById(payload.budgetId)
		if (!budget) return err("Budget not found")

		const transaction = budget.Transactions.find((t) => t.Value.id === payload.transactionId)
		if (!transaction) return err("Transaction not found")

		budget.removeExpense(transaction)
		await this.budgetRepository.update(budget)

		return ok()
	}
}
