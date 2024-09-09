import type { CreateUserDTO } from "$lib/dtos/user"
import { TYPES } from "$lib/server/dependencyInjection/types"
import type { ICommand } from "$lib/server/shared/command"
import { err, ok, type Result } from "$lib/server/shared/results"
import { UserEntity } from "../domain/userEntity"
import { UserPasswordVO } from "../domain/value-objects/userPassword"
import { UsernameVO } from "../domain/value-objects/username"
import type { IUserRepository } from "../infrastructure/userRepositoryPort"
import { inject, injectable } from "inversify"

@injectable()
export class CreateUserCommand implements ICommand<CreateUserDTO> {
	@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository

	async execute(payload: CreateUserDTO): Promise<Result<void, string>> {
		const usernameResult = UsernameVO.from(payload.username)
		if (usernameResult.ok === false) return err("Invalid username")

		const passwordResult = UserPasswordVO.from(payload.hashedPassword)
		if (passwordResult.ok === false) return err("Invalid password")

		const user = UserEntity.from({
			id: payload.id,
			username: usernameResult.data,
			hashedPassword: passwordResult.data
		})

		const existingUser = await this.userRepository.findOneByUsername(user.Username)
		if (existingUser) return err("User already exists")

		await this.userRepository.insert(user)

		return ok()
	}
}
