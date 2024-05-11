import type { BudgetDto } from "$lib/dtos/budget"
import { BudgetNotFoundError } from "../errors"
import { BudgetRepository, type IBudgetRepository } from "../repositories/budgetRepository"

export interface IBudgetService {
	getBudgetById(id: string): Promise<BudgetDto | null>
	getBudgetsByUserId(userId: string): Promise<BudgetDto[]>
}

export class BudgetService implements IBudgetService {
	private readonly budgetRepository: IBudgetRepository

	constructor() {
		this.budgetRepository = new BudgetRepository()
	}

	async getBudgetById(id: string): Promise<BudgetDto | null> {
		let budget

		try {
			budget = await this.budgetRepository.getBudgetById(id)
		} catch (error) {
			if (error instanceof BudgetNotFoundError) return null
			throw error
		}

		return budget.toDTO()
	}

	async getBudgetsByUserId(userId: string): Promise<BudgetDto[]> {
		const budgets = await this.budgetRepository.getBudgetsByUserId(userId)
		return budgets.map((budget) => budget.toDTO())
	}
}
