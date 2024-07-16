import type { BudgetCreateDto, BudgetDto, BudgetEditDto } from "$lib/dtos/budget"
import { BudgetNotFoundError } from "../errors"
import { BudgetRepository, type IBudgetRepository } from "../repositories/budgetRepository"
import { getRandomId } from "../utils"

export interface IBudgetService {
	getBudgetById(id: string): Promise<BudgetDto | null>
	getBudgetsByUserId(userId: string): Promise<BudgetDto[]>
	createBudget(payload: BudgetCreateDto): Promise<boolean>
	editBudget(payload: BudgetEditDto): Promise<boolean>
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
		const nextReset = new Date()
		if (payload.resetFrequency === "weekly") nextReset.setDate(nextReset.getDate() + 7)
		if (payload.resetFrequency === "monthly") nextReset.setMonth(nextReset.getMonth() + 1)

		try {
			await this.budgetRepository.createBudget({
				id: getRandomId(),
				userId: payload.userId,
				amount: payload.amount,
				resetFrequency: payload.resetFrequency,
				name: payload.name,
				nextReset
			})
		} catch (error) {
			console.error(error)
			return false
		}

		return true
	}

	async editBudget(payload: BudgetEditDto): Promise<boolean> {
		try {
			await this.budgetRepository.editBudget({
				id: payload.id,
				amount: payload.amount,
				resetFrequency: payload.resetFrequency
			})
		} catch (error) {
			if (error instanceof BudgetNotFoundError) return false
			throw error
		}

		return true
	}
}
