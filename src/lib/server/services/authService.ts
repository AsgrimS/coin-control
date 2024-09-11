import { dev } from "$app/environment"
import { adapter } from "../db"
import type { IAuthService } from "./authServicePort"
import { injectable } from "inversify"
import { Cookie, generateId } from "lucia"
import { Lucia } from "lucia"
import { Argon2id } from "oslo/password"

const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		}
	}
})

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}

interface DatabaseUserAttributes {
	username: string
}

@injectable()
export class AuthService implements IAuthService {
	private readonly hashingAlgorithm: Argon2id
	private readonly lucia: Lucia

	constructor() {
		this.hashingAlgorithm = new Argon2id()
		this.lucia = lucia
	}

	get Lucia(): Lucia {
		return this.lucia
	}

	generateUserId() {
		return generateId(15)
	}

	async hashPassword(password: string): Promise<string> {
		return await this.hashingAlgorithm.hash(password)
	}

	async verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
		return await this.hashingAlgorithm.verify(hashedPassword, password)
	}

	async createSessionCookie(userId: string): Promise<Cookie> {
		const session = await lucia.createSession(userId, {})
		return lucia.createSessionCookie(session.id)
	}

	async invalidateSession(sessionId: string): Promise<Cookie> {
		await lucia.invalidateSession(sessionId)
		return lucia.createBlankSessionCookie()
	}
}
