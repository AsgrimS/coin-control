import { Entity } from "$lib/server/shared/entity"
import { DomainError } from "$lib/server/shared/errors"
import { err, ok, type Result } from "$lib/server/shared/results"
import type { UserEntity } from "../../user/domain/userEntity"
import type { BudgetAllowanceVO } from "./value-objects/budgetAllowance"
import type { BudgetNameVO } from "./value-objects/budgetName"
import type { ResetDateVO } from "./value-objects/resetDate"
import type { ResetFrequencyVO } from "./value-objects/resetFrequency"
import type { TransactionVO } from "./value-objects/transaction"

class TransactionNotFoundError extends DomainError {
	constructor() {
		super("Transaction does not on this budget.")
	}
}

type BudgetEntityProps = {
	id: string
	ownerId: string
	allowance: BudgetAllowanceVO
	resetFrequency: ResetFrequencyVO
	name: BudgetNameVO
	nextResetDate: ResetDateVO
	transactions: TransactionVO[]
}

export class BudgetEntity extends Entity {
	private constructor(
		protected readonly id: string,
		private readonly ownerId: string,
		private allowance: BudgetAllowanceVO,
		private resetFrequency: ResetFrequencyVO,
		private name: BudgetNameVO,
		private nextResetDate: ResetDateVO,
		private transactions: TransactionVO[]
	) {
		super()
	}

	get OwnerId(): string {
		return this.ownerId
	}

	get Allowance(): BudgetAllowanceVO {
		return this.allowance
	}

	get ResetFrequency(): ResetFrequencyVO {
		return this.resetFrequency
	}

	get Name(): BudgetNameVO {
		return this.name
	}

	get NextResetDate(): ResetDateVO {
		return this.nextResetDate
	}

	get Transactions(): TransactionVO[] {
		return this.transactions
	}

	static from({
		id,
		ownerId,
		allowance,
		resetFrequency,
		name,
		nextResetDate,
		transactions
	}: BudgetEntityProps): BudgetEntity {
		return new BudgetEntity(
			id,
			ownerId,
			allowance,
			resetFrequency,
			name,
			nextResetDate,
			transactions
		)
	}

	canBeAccessedBy(user: UserEntity): boolean {
		return this.ownerId === user.Id
	}

	addExpense(transaction: TransactionVO): void {
		this.transactions.push(transaction)
	}

	removeExpense(transaction: TransactionVO): Result<void, DomainError> {
		const transactionIdx = this.transactions.findIndex((t) => t.Value.id === transaction.Value.id)
		if (transactionIdx === -1) return err(new TransactionNotFoundError())

		this.transactions.splice(transactionIdx, 1)
		ok()
	}
}
