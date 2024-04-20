export interface UserDto {
	readonly id: string
	readonly username: string
	readonly hashedPassword: string
}

export interface UserCreateDto {
	readonly id: string
	readonly username: string
	readonly hashedPassword: string
}
