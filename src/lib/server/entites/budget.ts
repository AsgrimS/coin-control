import type { Frequency } from "$lib/common"
import type { BudgetDto } from "$lib/dtos/budget"

export class BudgetEntity {
	readonly id: string
	readonly userId: string
	readonly amount: number
	readonly resetFrequency: Frequency

	constructor({
		id,
		userId,
		amount,
		resetFrequency
	}: {
		id: string
		userId: string
		amount: number
		resetFrequency: Frequency
	}) {
		this.id = id
		this.userId = userId
		this.amount = amount
		this.resetFrequency = resetFrequency
	}

	toDTO(): BudgetDto {
		return {
			id: this.id,
			userId: this.userId,
			amount: this.amount,
			resetFrequency: this.resetFrequency
		}
	}
}
