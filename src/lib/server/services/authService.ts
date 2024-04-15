import { generateId } from "lucia"
import { Argon2id } from "oslo/password"

export interface IAuthService {
	generateUserId(): string
	hashPassword(password: string): Promise<string>
	verifyPassword(hashedPassword: string, password: string): Promise<boolean>
}

export class AuthService implements IAuthService {
	generateUserId() {
		return generateId(15)
	}

	async hashPassword(password: string): Promise<string> {
		return await new Argon2id().hash(password)
	}

	async verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
		return await new Argon2id().verify(hashedPassword, password)
	}
}
