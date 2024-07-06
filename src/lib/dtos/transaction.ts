export interface TransactionDto {
	readonly id: string
	readonly userId: string
	readonly budgetId: string
	readonly amount: number
	readonly createdAt: string
}

export interface TransactionCreateDto {
	readonly userId: string
	readonly budgetId: string
	readonly amount: number
}
