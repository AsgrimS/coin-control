import type { Frequency } from "$lib/common"
import { db } from "../db"
import { budgetTable } from "../db/schema"
import { BudgetEntity } from "../entites/budget"
import { BudgetNotFoundError } from "../errors"
import { sql } from "drizzle-orm"

type CreateBudgetPayload = {
	id: string
	userId: string
	amount: number
	resetFrequency: Frequency
}

export interface IBudgetRepository {
	getBudgetById(id: string): Promise<BudgetEntity>
	getBudgetsByUserId(userId: string): Promise<BudgetEntity[]>
	createBudget(payload: CreateBudgetPayload): Promise<void>
}

export class BudgetRepository implements IBudgetRepository {
	async getBudgetById(id: string): Promise<BudgetEntity> {
		const [existingBudget] = await db
			.select()
			.from(budgetTable)
			.where(sql`${budgetTable.id} = ${id}`)

		if (!existingBudget) throw new BudgetNotFoundError()

		return new BudgetEntity({
			id: existingBudget.id,
			userId: existingBudget.userId,
			amount: existingBudget.amount,
			resetFrequency: existingBudget.resetFrequency
		})
	}

	async getBudgetsByUserId(userId: string): Promise<BudgetEntity[]> {
		const budgets = await db
			.select()
			.from(budgetTable)
			.where(sql`${budgetTable.userId} = ${userId}`)

		return budgets.map(
			(budget) =>
				new BudgetEntity({
					id: budget.id,
					userId: budget.userId,
					amount: budget.amount,
					resetFrequency: budget.resetFrequency
				})
		)
	}

	async createBudget(payload: CreateBudgetPayload): Promise<void> {
		const { id, userId, amount, resetFrequency } = payload
		await db.insert(budgetTable).values({
			id,
			userId,
			amount,
			resetFrequency: resetFrequency
		})
	}
}
