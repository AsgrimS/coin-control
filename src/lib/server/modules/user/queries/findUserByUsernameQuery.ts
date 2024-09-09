import type { UserDTO } from "$lib/dtos/user"
import { TYPES } from "$lib/server/dependencyInjection/types"
import type { IQuery } from "$lib/server/shared/query"
import { err, ok, type Result } from "$lib/server/shared/results"
import { UsernameVO } from "../domain/value-objects/username"
import type { IUserRepository } from "../infrastructure/userRepositoryPort"
import { inject, injectable } from "inversify"

@injectable()
export class FindUserByUsernameQuery implements IQuery<string, UserDTO> {
	@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository

	async query(username: string): Promise<Result<UserDTO, string>> {
		const usernameResult = UsernameVO.from(username)

		if (usernameResult.ok === false) return err("Invalid username")

		const user = await this.userRepository.findOneByUsername(usernameResult.data)

		if (!user) return err("User not found")

		return ok({
			id: user.Id,
			username: user.Username.Value,
			hashedPassword: user.Password.Value
		})
	}
}
