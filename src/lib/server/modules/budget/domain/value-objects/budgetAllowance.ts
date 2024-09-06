import { DomainError } from "$lib/server/shared/errors"
import { err, ok, type Result } from "$lib/server/shared/results"
import { ValueObject } from "$lib/server/shared/valueObject"

class InvalidBudgetAllowanceError extends DomainError {
	constructor() {
		super("Invalid budget allowance. It must be a number greater than 0.")
	}
}

export class BudgetAllowanceVO extends ValueObject<number> {
	static from(value: number): Result<BudgetAllowanceVO, DomainError> {
		if (value <= 0) {
			return err(new InvalidBudgetAllowanceError())
		}

		return ok(new BudgetAllowanceVO(value))
	}

	static fromDB(value: number): BudgetAllowanceVO {
		return new BudgetAllowanceVO(value)
	}
}
