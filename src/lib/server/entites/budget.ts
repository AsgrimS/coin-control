import type { BudgetDto } from "$lib/dtos/budget"

export class BudgetEntity {
	readonly id: string
	readonly userId: string
	readonly amount: number
	readonly resetAt: Date

	constructor({
		id,
		userId,
		amount,
		resetAt
	}: {
		id: string
		userId: string
		amount: number
		resetAt: Date
	}) {
		this.id = id
		this.userId = userId
		this.amount = amount
		this.resetAt = resetAt
	}

	toDTO(): BudgetDto {
		return {
			id: this.id,
			userId: this.userId,
			amount: this.amount,
			resetAt: this.resetAt
		}
	}
}
