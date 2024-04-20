import type { UserDto } from "$lib/dtos/user"

export class UserEntity {
	readonly id: string
	readonly username: string
	readonly hashedPassword: string

	constructor({
		id,
		username,
		hashedPassword
	}: {
		id: string
		username: string
		hashedPassword: string
	}) {
		this.id = id
		this.username = username
		this.hashedPassword = hashedPassword
	}

	static fromDTO(dto: UserDto) {
		return new UserEntity({
			id: dto.id,
			username: dto.username,
			hashedPassword: dto.hashedPassword
		})
	}

	toDto(): UserDto {
		return {
			id: this.id,
			username: this.username,
			hashedPassword: this.hashedPassword
		}
	}
}
