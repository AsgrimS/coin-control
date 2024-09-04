import { Entity } from "$lib/server/shared/entity"
import type { DomainError } from "$lib/server/shared/errors"
import { err, ok, type Result } from "$lib/server/shared/results"
import { UserPasswordVO } from "./value-objects/userPassword"
import { UsernameVO } from "./value-objects/username"

type UserEntityProps = {
	id: string
	username: string
	hashedPassword: string
}

export class UserEntity extends Entity {
	private constructor(
		protected readonly id: string,
		private username: UsernameVO,
		private hashedPassword: UserPasswordVO
	) {
		super()
	}

	get Id(): string {
		return this.id
	}

	get Username(): string {
		return this.username.Value
	}

	get Password(): string {
		return this.hashedPassword.Value
	}

	static from = ({
		id,
		username,
		hashedPassword
	}: UserEntityProps): Result<UserEntity, DomainError> => {
		const resultUsernameVO = UsernameVO.from(username)
		const resultUserPasswordVO = UserPasswordVO.from(hashedPassword)

		if (resultUsernameVO.ok === false) return err(resultUsernameVO.error)
		if (resultUserPasswordVO.ok === false) return err(resultUserPasswordVO.error)

		return ok(new UserEntity(id, resultUsernameVO.data, resultUserPasswordVO.data))
	}

	changePassword(newPassword: string): Result<void, Error> {
		const userPassword = UserPasswordVO.from(newPassword)

		if (userPassword.ok === false) return err(userPassword.error)

		this.hashedPassword = userPassword.data

		return ok()
	}

	changeUsername(newUsername: string): Result<void, Error> {
		const username = UsernameVO.from(newUsername)

		if (username.ok === false) return err(username.error)

		this.username = username.data

		return ok()
	}
}
