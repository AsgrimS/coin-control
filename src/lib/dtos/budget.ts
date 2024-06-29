import type { Frequency } from "$lib/common"

export interface BudgetDto {
	readonly id: string
	readonly userId: string
	readonly amount: number
	readonly resetFrequency: Frequency
}

export interface BudgetCreateDto {
	readonly userId: string
	readonly amount: number
	readonly resetFrequency: Frequency
}
