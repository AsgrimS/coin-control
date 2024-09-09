import { db } from "$lib/server/db"
import { budgetTable, transactionTable } from "$lib/server/db/schema"
import type { Some } from "$lib/server/shared/results"
import { BudgetEntity } from "../domain/budgetEntity"
import { BudgetAllowanceVO } from "../domain/value-objects/budgetAllowance"
import { BudgetNameVO } from "../domain/value-objects/budgetName"
import { ResetDateVO } from "../domain/value-objects/resetDate"
import { ResetFrequencyVO } from "../domain/value-objects/resetFrequency"
import { TransactionVO } from "../domain/value-objects/transaction"
import type { IBudgetRepository } from "./budgetRepositoryPort"
import { and, desc, eq, notInArray, type InferSelectModel } from "drizzle-orm"
import { injectable } from "inversify"

type BudgetWithTransactions = InferSelectModel<typeof budgetTable> & {
	transactions: InferSelectModel<typeof transactionTable>[]
}

const buildBudgetEntity = (budget: BudgetWithTransactions): BudgetEntity => {
	return BudgetEntity.from({
		id: budget.id,
		ownerId: budget.userId,
		name: BudgetNameVO.fromDB(budget.name),
		allowance: BudgetAllowanceVO.fromDB(budget.amount),
		nextResetDate: ResetDateVO.fromDB(new Date(budget.nextReset)),
		resetFrequency: ResetFrequencyVO.fromDB(budget.resetFrequency),
		transactions: budget.transactions.map((transaction) =>
			TransactionVO.fromDB({
				id: transaction.id,
				amount: transaction.amount,
				title: transaction.title,
				budgetId: transaction.budgetId,
				createdAt: new Date(transaction.createdAt)
			})
		)
	})
}

@injectable()
export class BudgetRepository implements IBudgetRepository {
	async findOneById(id: string): Promise<Some<BudgetEntity>> {
		const budget = await db.query.budgetTable.findFirst({
			where: eq(budgetTable.id, id),
			with: {
				transactions: {
					orderBy: desc(transactionTable.createdAt)
				}
			}
		})

		if (!budget) return null

		return BudgetEntity.from({
			id: budget.id,
			ownerId: budget.userId,
			name: BudgetNameVO.fromDB(budget.name),
			allowance: BudgetAllowanceVO.fromDB(budget.amount),
			nextResetDate: ResetDateVO.fromDB(new Date(budget.nextReset)),
			resetFrequency: ResetFrequencyVO.fromDB(budget.resetFrequency),
			transactions: budget.transactions.map((transaction) =>
				TransactionVO.fromDB({
					id: transaction.id,
					amount: transaction.amount,
					title: transaction.title,
					budgetId: transaction.budgetId,
					createdAt: new Date(transaction.createdAt)
				})
			)
		})
	}

	async findByOwnerId(ownerId: string): Promise<BudgetEntity[]> {
		const budgets = await db.query.budgetTable.findMany({
			where: eq(budgetTable.userId, ownerId),
			with: {
				transactions: {
					orderBy: desc(transactionTable.createdAt)
				}
			}
		})

		return budgets.map(buildBudgetEntity)
	}

	async update(budget: BudgetEntity): Promise<void> {
		await db.transaction(async (tx) => {
			await tx
				.update(budgetTable)
				.set({
					name: budget.Name.Value,
					amount: budget.Allowance.Value,
					resetFrequency: budget.ResetFrequency.Value,
					nextReset: budget.NextResetDate.Value.toISOString()
				})
				.where(eq(budgetTable.id, budget.Id))

			await tx.delete(transactionTable).where(
				and(
					eq(transactionTable.budgetId, budget.Id),
					notInArray(
						transactionTable.id,
						budget.Transactions.map((t) => t.Value.id)
					)
				)
			)

			for (const transaction of budget.Transactions) {
				await tx
					.insert(transactionTable)
					.values({
						id: transaction.Value.id,
						budgetId: budget.Id,
						createdAt: transaction.Value.createdAt.toISOString(),
						amount: transaction.Value.amount,
						title: transaction.Value.title
					})
					.onConflictDoNothing()
			}
		})
	}

	async insert(budget: BudgetEntity): Promise<void> {
		await db.transaction(async (tx) => {
			await tx.insert(budgetTable).values({
				id: budget.Id,
				userId: budget.OwnerId,
				name: budget.Name.Value,
				amount: budget.Allowance.Value,
				resetFrequency: budget.ResetFrequency.Value,
				nextReset: budget.NextResetDate.Value.toISOString()
			})

			for (const transaction of budget.Transactions) {
				await tx.insert(transactionTable).values({
					id: transaction.Value.id,
					budgetId: budget.Id,
					createdAt: transaction.Value.createdAt.toISOString(),
					amount: transaction.Value.amount,
					title: transaction.Value.title
				})
			}
		})
	}
}
