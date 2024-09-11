import type { Cookie, Lucia } from "lucia"

export interface IAuthService {
	get Lucia(): Lucia

	generateUserId(): string
	hashPassword(password: string): Promise<string>
	verifyPassword(hashedPassword: string, password: string): Promise<boolean>
	createSessionCookie(userId: string): Promise<Cookie>
	invalidateSession(sessionId: string): Promise<Cookie>
}
