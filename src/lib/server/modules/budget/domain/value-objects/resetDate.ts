import { DomainError } from "$lib/server/shared/errors"
import { ok, type Result } from "$lib/server/shared/results"
import { ValueObject } from "$lib/server/shared/valueObject"

export class ResetDateVO extends ValueObject<Date> {
	static from(value: Date): Result<ResetDateVO, DomainError> {
		return ok(new ResetDateVO(value))
	}

	static fromDB(value: Date): ResetDateVO {
		return new ResetDateVO(value)
	}

	isInThePast(): boolean {
		return this.value <= new Date()
	}
}
