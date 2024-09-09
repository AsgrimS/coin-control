import type { Some } from "$lib/server/shared/results"
import type { UserEntity } from "../domain/userEntity"
import type { UsernameVO } from "../domain/value-objects/username"

export interface IUserRepository {
	findOneById(id: string): Promise<Some<UserEntity>>
	findOneByUsername(username: UsernameVO): Promise<Some<UserEntity>>
	update(user: UserEntity): Promise<void>
	insert(user: UserEntity): Promise<void>
}
