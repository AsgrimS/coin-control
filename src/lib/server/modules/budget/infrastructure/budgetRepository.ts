import { db } from "$lib/server/db"
import { budgetTable } from "$lib/server/db/schema"
import type { Some } from "$lib/server/shared/results"
import { BudgetEntity } from "../domain/budgetEntity"
import { BudgetAllowanceVO } from "../domain/value-objects/budgetAllowance"
import { BudgetNameVO } from "../domain/value-objects/budgetName"
import { ResetDateVO } from "../domain/value-objects/resetDate"
import { ResetFrequencyVO } from "../domain/value-objects/resetFrequency"
import type { IBudgetRepository } from "./budgetRepositoryPort"
import { eq, type InferSelectModel } from "drizzle-orm"
import { injectable } from "inversify"

const buildBudgetEntity = (budget: InferSelectModel<typeof budgetTable>): BudgetEntity => {
	return BudgetEntity.from({
		id: budget.id,
		ownerId: budget.userId,
		name: BudgetNameVO.fromDB(budget.name),
		allowance: BudgetAllowanceVO.fromDB(budget.amount),
		nextResetDate: ResetDateVO.fromDB(new Date(budget.nextReset)),
		resetFrequency: ResetFrequencyVO.fromDB(budget.resetFrequency)
	})
}

@injectable()
export class BudgetRepository implements IBudgetRepository {
	async findOneById(id: string): Promise<Some<BudgetEntity>> {
		const [budget] = await db.select().from(budgetTable).where(eq(budgetTable.id, id))

		if (!budget) return null

		return buildBudgetEntity(budget)
	}

	async findByOwnerId(ownerId: string): Promise<BudgetEntity[]> {
		const budgets = await db.select().from(budgetTable).where(eq(budgetTable.userId, ownerId))

		return budgets.map(buildBudgetEntity)
	}

	async update(budget: BudgetEntity): Promise<void> {
		await db
			.update(budgetTable)
			.set({
				name: budget.Name.Value,
				amount: budget.Allowance.Value,
				resetFrequency: budget.ResetFrequency.Value,
				nextReset: budget.NextResetDate.Value.toISOString()
			})
			.where(eq(budgetTable.id, budget.Id))
	}

	async insert(budget: BudgetEntity): Promise<void> {
		await db.insert(budgetTable).values({
			id: budget.Id,
			userId: budget.OwnerId,
			name: budget.Name.Value,
			amount: budget.Allowance.Value,
			resetFrequency: budget.ResetFrequency.Value,
			nextReset: budget.NextResetDate.Value.toISOString()
		})
	}
}
