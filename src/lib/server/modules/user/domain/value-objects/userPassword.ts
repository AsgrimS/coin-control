import { DomainError } from "$lib/server/shared/errors"
import { err, ok, type Result } from "$lib/server/shared/results"
import { ValueObject } from "$lib/server/shared/valueObject"

class InvalidUserPasswordLengthError extends DomainError {
	constructor() {
		super("Invalid user password length. Must be between 8 and 128 characters.")
	}
}

export class UserPasswordVO extends ValueObject<string> {
	static from(value: string): Result<UserPasswordVO, DomainError> {
		if (value.length < 8) {
			return err(new InvalidUserPasswordLengthError())
		}

		if (value.length > 128) {
			return err(new InvalidUserPasswordLengthError())
		}

		return ok(new UserPasswordVO(value))
	}

	/** Skips validation. Only to be used when creating a UserPasswordVO from a database value. */
	static fromDB(value: string): UserPasswordVO {
		return new UserPasswordVO(value)
	}
}
