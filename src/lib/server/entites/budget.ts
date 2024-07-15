import type { Frequency } from "$lib/common"
import type { BudgetDto } from "$lib/dtos/budget"

export class BudgetEntity {
	readonly id: string
	readonly userId: string
	readonly amount: number
	readonly resetFrequency: Frequency
	readonly name: string

	constructor({
		id,
		userId,
		amount,
		resetFrequency,
		name
	}: {
		id: string
		userId: string
		amount: number
		resetFrequency: Frequency
		name: string
	}) {
		this.id = id
		this.userId = userId
		this.amount = amount
		this.resetFrequency = resetFrequency
		this.name = name
	}

	toDTO(): BudgetDto {
		return {
			id: this.id,
			userId: this.userId,
			amount: this.amount,
			resetFrequency: this.resetFrequency,
			name: this.name
		}
	}
}
