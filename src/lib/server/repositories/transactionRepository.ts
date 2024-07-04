import { db } from "../db"
import { transactionTable } from "../db/schema"
import { TransactionEntity } from "../entites/transaction"
import { TransactionNotFoundError } from "../errors"
import { sql } from "drizzle-orm"

type CreateTransactionPayload = {
	id: string
	userId: string
	budgetId: string
	amount: number
}

export interface ITransactionRepository {
	getTransactionById(id: string): Promise<TransactionEntity>
	getTransactionsByUserId(userId: string): Promise<TransactionEntity[]>
	createTransaction(payload: CreateTransactionPayload): Promise<void>
}

export class TransactionRepository implements ITransactionRepository {
	async getTransactionById(id: string): Promise<TransactionEntity> {
		const [transaction] = await db
			.select()
			.from(transactionTable)
			.where(sql`${transactionTable.id} = ${id}`)

		if (!transaction) throw new TransactionNotFoundError()

		return new TransactionEntity({
			id: transaction.id,
			userId: transaction.userId,
			budgetId: transaction.budgetId,
			amount: transaction.amount
		})
	}

	async getTransactionsByUserId(userId: string): Promise<TransactionEntity[]> {
		return (await db
			.select()
			.from(transactionTable)
			.where(sql`${transactionTable.userId} = ${userId}`)) as TransactionEntity[]
	}

	async createTransaction(payload: CreateTransactionPayload): Promise<void> {
		const { id, userId, budgetId, amount } = payload

		await db.insert(transactionTable).values({
			id,
			userId,
			budgetId,
			amount
		})
	}
}
