import type { TransactionDto } from "$lib/dtos/transaction"

export class TransactionEntity {
	readonly id: string
	readonly userId: string
	readonly budgetId: string
	readonly createdAt: string
	readonly amount: number
	readonly title: string | null

	constructor({
		id,
		userId,
		amount,
		createdAt,
		budgetId,
		title
	}: {
		id: string
		userId: string
		budgetId: string
		createdAt: string
		amount: number
		title: string | null
	}) {
		this.id = id
		this.userId = userId
		this.amount = amount
		this.createdAt = createdAt
		this.budgetId = budgetId
		this.title = title
	}

	toDTO(): TransactionDto {
		return {
			id: this.id,
			userId: this.userId,
			budgetId: this.budgetId,
			createdAt: this.createdAt,
			amount: this.amount,
			title: this.title
		}
	}
}
