import { DomainError } from "$lib/server/shared/errors"
import { err, ok, type Result } from "$lib/server/shared/results"
import { ValueObject } from "$lib/server/shared/valueObject"

class InvalidTransactionAmountError extends DomainError {
	constructor() {
		super("Invalid transaction amount. It must be a number greater than 0.")
	}
}

class InvalidTransactionTitleError extends DomainError {
	constructor() {
		super("Invalid transaction title. It must be a string with at most 64 characters.")
	}
}

type TransactionProps = {
	id: string
	budgetId: string
	createdAt: Date
	amount: number
	title: string | null
}

export class TransactionVO extends ValueObject<TransactionProps> {
	static from(props: TransactionProps): Result<TransactionVO, DomainError> {
		const { amount, title } = props

		if (amount <= 0) return err(new InvalidTransactionAmountError())
		if (title && title.length > 64) return err(new InvalidTransactionTitleError())

		return ok(new TransactionVO(props))
	}

	static fromDB(props: TransactionProps): TransactionVO {
		return new TransactionVO(props)
	}
}
