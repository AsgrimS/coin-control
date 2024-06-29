import type { BudgetCreateDto, BudgetDto } from "$lib/dtos/budget"
import { BudgetNotFoundError } from "../errors"
import { BudgetRepository, type IBudgetRepository } from "../repositories/budgetRepository"
import { generateId } from "lucia"

export interface IBudgetService {
	getBudgetById(id: string): Promise<BudgetDto | null>
	getBudgetsByUserId(userId: string): Promise<BudgetDto[]>
	createBudget(payload: BudgetCreateDto): Promise<boolean>
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

	async createBudget(payload: BudgetCreateDto): Promise<boolean> {
		try {
			await this.budgetRepository.createBudget({
				id: generateId(15),
				userId: payload.userId,
				amount: payload.amount,
				resetFrequency: payload.resetFrequency
			})
		} catch (error) {
			console.error(error)
			return false
		}

		return true
	}
}
