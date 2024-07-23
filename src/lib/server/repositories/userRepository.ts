import { db } from "../db"
import { userTable } from "../db/schema"
import { UserEntity } from "../entites/user"
import { UserAlreadyExistsError, UserNotFoundError } from "../errors"
import { eq, sql } from "drizzle-orm"

type CreateUserPayload = {
	username: string
	hashedPassword: string
	id: string
}

export interface IUserRepository {
	createUser(payload: CreateUserPayload): Promise<void>
	getUserByUsername(username: string): Promise<UserEntity>
	getUserById(id: string): Promise<UserEntity>
}

export class UserRepository implements IUserRepository {
	async createUser(payload: CreateUserPayload): Promise<void> {
		const { username, hashedPassword, id } = payload
		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(sql`lower(${userTable.username}) = ${username.toLowerCase()}`)

		if (existingUser) throw new UserAlreadyExistsError()

		await db.insert(userTable).values({
			id,
			username: username,
			hashed_password: hashedPassword
		})
	}
	async getUserByUsername(username: string): Promise<UserEntity> {
		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(sql`lower(${userTable.username}) = ${username.toLowerCase()}`)

		if (!existingUser) throw new UserNotFoundError()

		return new UserEntity({
			id: existingUser.id,
			username: existingUser.username,
			hashedPassword: existingUser.hashed_password
		})
	}
	async getUserById(id: string): Promise<UserEntity> {
		const [existingUser] = await db.select().from(userTable).where(eq(userTable.id, id))

		if (!existingUser) throw new UserNotFoundError()

		return new UserEntity({
			id: existingUser.id,
			username: existingUser.username,
			hashedPassword: existingUser.hashed_password
		})
	}
}

/** Mock implementation of the IUserRepository interface to be used in tests for other services. */
export class MockUserRepository implements IUserRepository {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async createUser(_payload: CreateUserPayload): Promise<void> {
		return
	}

	async getUserByUsername(username: string): Promise<UserEntity> {
		return new UserEntity({
			id: "mock-id",
			username,
			hashedPassword: "mock-password"
		})
	}

	async getUserById(id: string): Promise<UserEntity> {
		return new UserEntity({
			id,
			username: "mock-username",
			hashedPassword: "mock-password"
		})
	}
}
