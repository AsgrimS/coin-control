import { Entity } from "$lib/server/shared/entity"
import { UserPasswordVO } from "./value-objects/userPassword"
import { UsernameVO } from "./value-objects/username"

type UserEntityProps = {
	id: string
	username: UsernameVO
	hashedPassword: UserPasswordVO
}

export class UserEntity extends Entity {
	private constructor(
		protected readonly id: string,
		private username: UsernameVO,
		private hashedPassword: UserPasswordVO
	) {
		super()
	}

	get Username(): UsernameVO {
		return this.username
	}

	get Password(): UserPasswordVO {
		return this.hashedPassword
	}

	static from = ({ id, username, hashedPassword }: UserEntityProps): UserEntity => {
		return new UserEntity(id, username, hashedPassword)
	}

	changePassword(newPassword: UserPasswordVO): void {
		this.hashedPassword = newPassword
	}

	changeUsername(newUsername: UsernameVO): void {
		this.username = newUsername
	}
}
