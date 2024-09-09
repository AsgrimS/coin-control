import type { Frequency } from "$lib/common"

export interface BudgetDTO {
	readonly id: string
	readonly ownerId: string
	readonly allowance: number
	readonly resetFrequency: Frequency
	readonly name: string
	readonly nextReset: Date
}

export interface CreateBudgetDTO {
	readonly name: string
	readonly ownerId: string
	readonly allowance: number
	readonly resetFrequency: Frequency
}

export interface BudgetEditDto {
	readonly id: string
	readonly amount: number
	readonly resetFrequency: Frequency
	readonly name: string
	readonly nextReset: Date
}
