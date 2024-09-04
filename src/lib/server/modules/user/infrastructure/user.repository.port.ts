import type { UserEntity } from "$lib/server/entites/user"
import type { Result, Some } from "$lib/server/shared/results"

export interface IUserRepository {
	findOneById(id: string): Promise<Result<Some<UserEntity>, Error>>
}
