import { DomainError } from "$lib/server/shared/errors"
import { err, ok, type Result } from "$lib/server/shared/results"
import { ValueObject } from "$lib/server/shared/valueObject"

class InvalidBudgetNameError extends DomainError {
	constructor() {
		super("Invalid budget name. It must be a non-empty string with at most 22 characters.")
	}
}

export class BudgetNameVO extends ValueObject<string> {
	static from(value: string): Result<BudgetNameVO, DomainError> {
		if (value.length === 0) {
			return err(new InvalidBudgetNameError())
		}

		if (value.length > 22) {
			return err(new InvalidBudgetNameError())
		}

		return ok(new BudgetNameVO(value))
	}

	static fromDB(value: string): BudgetNameVO {
		return new BudgetNameVO(value)
	}
}
