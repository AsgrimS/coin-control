export class UserAlreadyExistsError extends Error {
	name = "UserAlreadyExistsError"
}

export class UserNotFoundError extends Error {
	name = "UserNotFoundError"
}

export class BudgetNotFoundError extends Error {
	name = "BudgetNotFoundError"
}

export class TransactionNotFoundError extends Error {
	name = "TransactionNotFoundError"
}
