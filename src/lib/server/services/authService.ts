import { generateId } from "lucia"
import { Argon2id } from "oslo/password"

export interface IAuthService {
	generateUserId(): string
	hashPassword(password: string): Promise<string>
	verifyPassword(hashedPassword: string, password: string): Promise<boolean>
}

export class AuthService implements IAuthService {
	private readonly hashingAlgorithm: Argon2id

	constructor() {
		this.hashingAlgorithm = new Argon2id()
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
}
