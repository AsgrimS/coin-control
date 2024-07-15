import type { Frequency } from "$lib/common"

export interface BudgetDto {
	readonly id: string
	readonly userId: string
	readonly amount: number
	readonly resetFrequency: Frequency
	readonly name: string
}

export interface BudgetCreateDto {
	readonly userId: string
	readonly amount: number
	readonly resetFrequency: Frequency
	readonly name: string
}

export interface BudgetEditDto {
	readonly id: string
	readonly amount: number
	readonly resetFrequency: Frequency
	readonly name: string
}
