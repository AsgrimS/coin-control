export interface TransactionDto {
	readonly id: string
	readonly userId: string
	readonly budgetId: string
	readonly amount: number
}

export interface TransactionCreateDto {
	readonly id: string
	readonly userId: string
	readonly budgetId: string
	readonly amount: number
}
