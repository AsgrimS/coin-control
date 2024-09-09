import { db } from "$lib/server/db"
import { userTable } from "$lib/server/db/schema"
import { type Some } from "$lib/server/shared/results"
import { UserEntity } from "../domain/userEntity"
import { UserPasswordVO } from "../domain/value-objects/userPassword"
import { UsernameVO } from "../domain/value-objects/username"
import type { IUserRepository } from "./userRepositoryPort"
import { eq, sql, type InferSelectModel } from "drizzle-orm"
import { injectable } from "inversify"

const buildUserEntity = (user: InferSelectModel<typeof userTable>): UserEntity => {
	return UserEntity.from({
		id: user.id,
		username: UsernameVO.fromDB(user.username),
		hashedPassword: UserPasswordVO.fromDB(user.hashed_password)
	})
}

@injectable()
export class UserRepository implements IUserRepository {
	async findOneById(id: string): Promise<Some<UserEntity>> {
		const [user] = await db.select().from(userTable).where(eq(userTable.id, id))

		if (!user) return null

		return buildUserEntity(user)
	}

	async findOneByUsername(username: UsernameVO): Promise<Some<UserEntity>> {
		const [user] = await db
			.select()
			.from(userTable)
			.where(sql`lower(${userTable.username}) = ${username.Value.toLowerCase()}`)

		if (!user) return null

		return buildUserEntity(user)
	}

	async insert(user: UserEntity): Promise<void> {
		await db.insert(userTable).values({
			id: user.Id,
			username: user.Username.Value,
			hashed_password: user.Password.Value
		})
	}

	async update(user: UserEntity): Promise<void> {
		await db
			.update(userTable)
			.set({
				username: user.Username.Value,
				hashed_password: user.Password.Value
			})
			.where(eq(userTable.id, user.Id))
	}
}
