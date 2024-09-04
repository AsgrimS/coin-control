import { DomainError } from "$lib/server/shared/errors"
import { err, ok, type Result } from "$lib/server/shared/results"
import { ValueObject } from "$lib/server/shared/valueObject"

class InvalidUsernameLengthError extends DomainError {
	constructor() {
		super("Invalid username length. Must be between 3 and 64 characters.")
	}
}

export class UsernameVO extends ValueObject {
	private constructor(private readonly value: string) {
		super()
	}

	get Value(): string {
		return this.value
	}

	static from(value: string): Result<UsernameVO, DomainError> {
		if (value.length < 8) {
			return err(new InvalidUsernameLengthError())
		}

		if (value.length > 128) {
			return err(new InvalidUsernameLengthError())
		}

		return ok(new UsernameVO(value))
	}
}
