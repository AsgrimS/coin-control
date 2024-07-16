import { db } from "../db"
import { transactionTable } from "../db/schema"
import { TransactionEntity } from "../entites/transaction"
import { TransactionNotFoundError } from "../errors"
import { and, desc, eq, gte } from "drizzle-orm"

type CreateTransactionPayload = {
	id: string
	userId: string
	budgetId: string
	amount: number
	title: string | null
	createdAt: Date
}

type GetTransactionsByBudgetIdPayload = {
	budgetId: string
	newerThanEqual?: Date
}

export interface ITransactionRepository {
	getTransactionById(id: string): Promise<TransactionEntity>
	getTransactionsByUserId(userId: string): Promise<TransactionEntity[]>
	getTransactionsByBudgetId(payload: GetTransactionsByBudgetIdPayload): Promise<TransactionEntity[]>
	createTransaction(payload: CreateTransactionPayload): Promise<void>
	deleteTransaction(id: string): Promise<void>
}

export class TransactionRepository implements ITransactionRepository {
	async getTransactionById(id: string): Promise<TransactionEntity> {
		const [transaction] = await db
			.select()
			.from(transactionTable)
			.where(eq(transactionTable.id, id))

		if (!transaction) throw new TransactionNotFoundError()

		return new TransactionEntity({
			...transaction,
			createdAt: new Date(transaction.createdAt)
		})
	}

	async getTransactionsByUserId(userId: string): Promise<TransactionEntity[]> {
		const transactions = await db
			.select()
			.from(transactionTable)
			.where(eq(transactionTable.userId, userId))
			.orderBy(desc(transactionTable.createdAt))

		return transactions.map(
			(transaction) =>
				new TransactionEntity({
					...transaction,
					createdAt: new Date(transaction.createdAt)
				})
		)
	}

	async getTransactionsByBudgetId(
		payload: GetTransactionsByBudgetIdPayload
	): Promise<TransactionEntity[]> {
		const { budgetId, newerThanEqual } = payload

		const transactions = await db
			.select()
			.from(transactionTable)
			.where(
				and(
					eq(transactionTable.budgetId, budgetId),
					newerThanEqual && gte(transactionTable.createdAt, newerThanEqual.toISOString())
				)
			)
			.orderBy(desc(transactionTable.createdAt))

		return transactions.map(
			(transaction) =>
				new TransactionEntity({
					...transaction,
					createdAt: new Date(transaction.createdAt)
				})
		)
	}

	async createTransaction(payload: CreateTransactionPayload): Promise<void> {
		const { createdAt } = payload

		await db.insert(transactionTable).values({
			...payload,
			createdAt: createdAt.toISOString()
		})
	}

	async deleteTransaction(id: string): Promise<void> {
		const deleteOperation = await db.delete(transactionTable).where(eq(transactionTable.id, id))

		if (deleteOperation.rowsAffected === 0) throw new TransactionNotFoundError()
	}
}
