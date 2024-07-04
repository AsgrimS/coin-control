import type { TransactionDto } from "$lib/dtos/transaction"

export class TransactionEntity {
	readonly id: string
	readonly userId: string
	readonly budgetId: string
	readonly amount: number

	constructor({
		id,
		userId,
		amount,
		budgetId
	}: {
		id: string
		userId: string
		budgetId: string
		amount: number
	}) {
		this.id = id
		this.userId = userId
		this.amount = amount
		this.budgetId = budgetId
	}

	toDTO(): TransactionDto {
		return {
			id: this.id,
			userId: this.userId,
			budgetId: this.budgetId,
			amount: this.amount
		}
	}
}
