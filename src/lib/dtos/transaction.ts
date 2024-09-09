export interface TransactionDTO {
	readonly id: string
	readonly amount: number
	readonly createdAt: Date
	readonly title: string | null
}

export interface CreateTransactionDTO {
	readonly budgetId: string
	readonly amount: number
	readonly title: string | null
}

export interface RemoveTransactionDTO {
	readonly budgetId: string
	readonly transactionId: string
}
