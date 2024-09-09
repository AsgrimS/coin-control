import type { Frequency } from "$lib/common"
import type { TransactionDTO } from "./transaction"

export interface BudgetDTO {
	readonly id: string
	readonly ownerId: string
	readonly allowance: number
	readonly resetFrequency: Frequency
	readonly name: string
	readonly nextReset: Date
	readonly transactions: TransactionDTO[]
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
