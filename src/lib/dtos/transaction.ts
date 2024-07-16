export interface TransactionDto {
	readonly id: string
	readonly userId: string
	readonly budgetId: string
	readonly amount: number
	readonly createdAt: Date
	readonly title: string | null
}

export interface TransactionCreateDto {
	readonly userId: string
	readonly budgetId: string
	readonly amount: number
	readonly title: string | null
}
