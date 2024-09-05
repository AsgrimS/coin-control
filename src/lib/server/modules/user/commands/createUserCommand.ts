import type { CreateUserDTO } from "$lib/dtos/user"
import { err, ok, type Result } from "$lib/server/shared/results"
import { UserEntity } from "../domain/userEntity"
import { UserPasswordVO } from "../domain/value-objects/userPassword"
import { UsernameVO } from "../domain/value-objects/username"
import { UserRepository } from "../infrastructure/userRepository"

export const createUserCommand = async (payload: CreateUserDTO): Promise<Result<void, string>> => {
	const userRepository = new UserRepository()

	const useranemeResult = UsernameVO.from(payload.username)
	const passwordResult = UserPasswordVO.from(payload.hashedPassword)

	if (useranemeResult.ok === false) return err("Invalid username")
	if (passwordResult.ok === false) return err("Invalid password")

	const user = UserEntity.from({
		id: payload.id,
		username: useranemeResult.data,
		hashedPassword: passwordResult.data
	})

	const existingUser = await userRepository.findOneByUsername(user.Username)

	if (existingUser) return err("User already exists")

	await userRepository.save(user)

	return ok()
}
