export interface BudgetDto {
	readonly id: string
	readonly userId: string
	readonly amount: number
	readonly resetAt: Date
}

export interface BudgetCreateDto {
	readonly userId: string
	readonly amount: number
	readonly resetAt: Date
}
