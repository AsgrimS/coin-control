import type { TransactionDto } from "$lib/dtos/transaction"

export class TransactionEntity {
	readonly id: string
	readonly userId: string
	readonly budgetId: string
	readonly createdAt: string
	readonly amount: number

	constructor({
		id,
		userId,
		amount,
		createdAt,
		budgetId
	}: {
		id: string
		userId: string
		budgetId: string
		createdAt: string
		amount: number
	}) {
		this.id = id
		this.userId = userId
		this.amount = amount
		this.createdAt = createdAt
		this.budgetId = budgetId
	}

	toDTO(): TransactionDto {
		return {
			id: this.id,
			userId: this.userId,
			budgetId: this.budgetId,
			createdAt: this.createdAt,
			amount: this.amount
		}
	}
}
