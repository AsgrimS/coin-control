import type { TransactionCreateDto, TransactionDto } from "$lib/dtos/transaction"
import { TransactionNotFoundError } from "../errors"
import {
	TransactionRepository,
	type ITransactionRepository
} from "../repositories/transactionRepository"
import { getRandomId } from "../utils"

export interface ITransactionService {
	getTransactionById(id: string): Promise<TransactionDto | null>
	getTransactionsByUserId(userId: string): Promise<TransactionDto[]>
	createTransaction(payload: TransactionCreateDto): Promise<boolean>
}

export class TransactionService implements ITransactionService {
	private readonly transactionRepository: ITransactionRepository

	constructor() {
		this.transactionRepository = new TransactionRepository()
	}

	async getTransactionById(id: string): Promise<TransactionDto | null> {
		let transaction

		try {
			transaction = await this.transactionRepository.getTransactionById(id)
		} catch (error) {
			if (error instanceof TransactionNotFoundError) return null
			throw error
		}

		return transaction.toDTO()
	}

	async getTransactionsByUserId(userId: string): Promise<TransactionDto[]> {
		const transactions = await this.transactionRepository.getTransactionsByUserId(userId)

		return transactions.map((transaction) => transaction.toDTO())
	}

	async createTransaction(payload: TransactionCreateDto): Promise<boolean> {
		try {
			await this.transactionRepository.createTransaction({
				id: getRandomId(),
				budgetId: payload.budgetId,
				userId: payload.userId,
				amount: payload.amount
			})
		} catch (error) {
			console.error(error)
			return false
		}

		return true
	}
}
