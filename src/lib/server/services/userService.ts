import type { UserCreateDto, UserDto } from "$lib/dtos/user"
import { UserAlreadyExistsError } from "$lib/errors"
import { db } from "../db"
import { userTable } from "../db/schema"
import { sql } from "drizzle-orm"

export interface IUserService {
	createUser(payload: UserCreateDto): Promise<UserAlreadyExistsError | void>
	getUserByUsername(username: string): Promise<UserDto | null>
	getUserById(id: string): Promise<UserDto | null>
}

export class UserService implements IUserService {
	async createUser(payload: UserCreateDto): Promise<UserAlreadyExistsError | void> {
		const { username, hashedPassword, id } = payload
		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(sql`lower(${userTable.username}) = ${username.toLowerCase()}`)

		if (existingUser) return new UserAlreadyExistsError()

		await db.insert(userTable).values({
			id,
			username: username,
			hashed_password: hashedPassword
		})
	}

	async getUserByUsername(username: string): Promise<UserDto | null> {
		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(sql`lower(${userTable.username}) = ${username.toLowerCase()}`)

		if (!existingUser) return null

		return {
			id: existingUser.id,
			username: existingUser.username,
			hashedPassword: existingUser.hashed_password
		}
	}

	async getUserById(id: string): Promise<UserDto | null> {
		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(sql`${userTable.id} = ${id}`)

		if (!existingUser) return null

		return {
			id: existingUser.id,
			username: existingUser.username,
			hashedPassword: existingUser.hashed_password
		}
	}
}
