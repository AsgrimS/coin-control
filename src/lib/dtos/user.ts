export interface UserDto {
	readonly id: string
	readonly username: string
	readonly hashedPassword: string
}

export interface CreateUserDTO {
	readonly id: string
	readonly username: string
	readonly hashedPassword: string
}
