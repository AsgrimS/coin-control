import type { UserCreateDto, UserDto } from "$lib/dtos/user"
import { UserAlreadyExistsError, UserNotFoundError } from "../errors"
import { UserRepository, type IUserRepository } from "../repositories/userRepository"

export interface IUserService {
	createUser(payload: UserCreateDto): Promise<boolean>
	getUserByUsername(username: string): Promise<UserDto | null>
	getUserById(id: string): Promise<UserDto | null>
}

export class UserService implements IUserService {
	private readonly userRepository: IUserRepository

	constructor() {
		this.userRepository = new UserRepository()
	}

	async createUser(payload: UserCreateDto): Promise<boolean> {
		try {
			await this.userRepository.createUser({
				id: payload.id,
				username: payload.username,
				hashedPassword: payload.hashedPassword
			})
		} catch (error) {
			if (error instanceof UserAlreadyExistsError) return false
			throw error
		}

		return true
	}

	async getUserByUsername(username: string): Promise<UserDto | null> {
		let user

		try {
			user = await this.userRepository.getUserByUsername(username)
		} catch (error) {
			if (error instanceof UserNotFoundError) return null
			throw error
		}

		return user.toDTO()
	}

	async getUserById(id: string): Promise<UserDto | null> {
		let user

		try {
			user = await this.userRepository.getUserById(id)
		} catch (error) {
			if (error instanceof UserNotFoundError) return null
			throw error
		}

		return user.toDTO()
	}
}
