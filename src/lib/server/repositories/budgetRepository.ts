import type { Frequency } from "$lib/common"
import { db } from "../db"
import { budgetTable } from "../db/schema"
import { BudgetEntity } from "../entites/budget"
import { BudgetNotFoundError } from "../errors"
import { eq } from "drizzle-orm"

type CreateBudgetPayload = {
	id: string
	userId: string
	amount: number
	resetFrequency: Frequency
	name: string
	nextReset: Date
}

type EditBudgetPayload = {
	id: string
	amount: number
	resetFrequency: Frequency
	nextReset: Date
}

export interface IBudgetRepository {
	getBudgetById(id: string): Promise<BudgetEntity>
	getBudgetsByUserId(userId: string): Promise<BudgetEntity[]>
	createBudget(payload: CreateBudgetPayload): Promise<void>
	editBudget(payload: EditBudgetPayload): Promise<void>
}

export class BudgetRepository implements IBudgetRepository {
	async getBudgetById(id: string): Promise<BudgetEntity> {
		const [budget] = await db.select().from(budgetTable).where(eq(budgetTable.id, id))

		if (!budget) throw new BudgetNotFoundError()

		return new BudgetEntity({
			...budget,
			nextReset: new Date(budget.nextReset)
		})
	}

	async getBudgetsByUserId(userId: string): Promise<BudgetEntity[]> {
		const budgets = await db.select().from(budgetTable).where(eq(budgetTable.userId, userId))

		return budgets.map(
			(budget) =>
				new BudgetEntity({
					...budget,
					nextReset: new Date(budget.nextReset)
				})
		)
	}

	async createBudget(payload: CreateBudgetPayload): Promise<void> {
		const { nextReset } = payload
		await db.insert(budgetTable).values({
			...payload,
			nextReset: nextReset.toISOString()
		})
	}

	async editBudget(payload: EditBudgetPayload): Promise<void> {
		const { id, amount, resetFrequency, nextReset } = payload

		const updateOperation = await db
			.update(budgetTable)
			.set({
				amount,
				resetFrequency,
				nextReset: nextReset.toISOString()
			})
			.where(eq(budgetTable.id, id))

		if (updateOperation.rowsAffected === 0) throw new BudgetNotFoundError()
	}
}
