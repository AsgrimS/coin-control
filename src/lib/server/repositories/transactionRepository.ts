import { db } from "../db"
import { transactionTable } from "../db/schema"
import { TransactionEntity } from "../entites/transaction"
import { TransactionNotFoundError } from "../errors"
import { desc, eq } from "drizzle-orm"

type CreateTransactionPayload = {
	id: string
	userId: string
	budgetId: string
	amount: number
	title: string | null
}

export interface ITransactionRepository {
	getTransactionById(id: string): Promise<TransactionEntity>
	getTransactionsByUserId(userId: string): Promise<TransactionEntity[]>
	getTransactionsByBudgetId(budgetId: string): Promise<TransactionEntity[]>
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
			id: transaction.id,
			userId: transaction.userId,
			budgetId: transaction.budgetId,
			createdAt: transaction.createdAt,
			amount: transaction.amount,
			title: transaction.title
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
					id: transaction.id,
					userId: transaction.userId,
					budgetId: transaction.budgetId,
					createdAt: transaction.createdAt,
					amount: transaction.amount,
					title: transaction.title
				})
		)
	}

	async getTransactionsByBudgetId(budgetId: string): Promise<TransactionEntity[]> {
		const transactions = await db
			.select()
			.from(transactionTable)
			.where(eq(transactionTable.budgetId, budgetId))
			.orderBy(desc(transactionTable.createdAt))

		return transactions.map(
			(transaction) =>
				new TransactionEntity({
					id: transaction.id,
					userId: transaction.userId,
					budgetId: transaction.budgetId,
					createdAt: transaction.createdAt,
					amount: transaction.amount,
					title: transaction.title
				})
		)
	}

	async createTransaction(payload: CreateTransactionPayload): Promise<void> {
		const { id, userId, budgetId, amount, title } = payload

		await db.insert(transactionTable).values({
			id,
			userId,
			budgetId,
			amount,
			title
		})
	}

	async deleteTransaction(id: string): Promise<void> {
		const deleteOperation = await db.delete(transactionTable).where(eq(transactionTable.id, id))

		if (deleteOperation.rowsAffected === 0) throw new TransactionNotFoundError()
	}
}
