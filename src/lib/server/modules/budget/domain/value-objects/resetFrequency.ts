import type { Frequency } from "$lib/common"
import { DomainError } from "$lib/server/shared/errors"
import { err, ok, type Result } from "$lib/server/shared/results"
import { ValueObject } from "$lib/server/shared/valueObject"

class InvalidResetFrequencyError extends DomainError {
	constructor() {
		super("Invalid reset frequency. It must be either 'weekly' or 'monthly'.")
	}
}

export class ResetFrequencyVO extends ValueObject<Frequency> {
	static from(value: Frequency): Result<ResetFrequencyVO, DomainError> {
		if (value !== "weekly" && value !== "monthly") {
			return err(new InvalidResetFrequencyError())
		}

		return ok(new ResetFrequencyVO(value))
	}

	static fromDB(value: Frequency): ResetFrequencyVO {
		return new ResetFrequencyVO(value)
	}
}
