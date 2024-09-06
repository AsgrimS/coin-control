import type { Some } from "$lib/server/shared/results"

export interface IBudgetRepository {
	data: string
	// findOneById(id: string): Promise<Some<UserEntity>>
	// findOneByUsername(username: UsernameVO): Promise<Some<UserEntity>>
	// save(user: UserEntity): Promise<void>
}
