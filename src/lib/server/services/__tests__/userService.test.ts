import type { UserCreateDto, UserDto } from "$lib/dtos/user"
import { UserAlreadyExistsError, UserNotFoundError } from "$lib/server/errors"
import { UserRepository } from "$lib/server/repositories/userRepository"
import { UserService, type IUserService } from "$lib/server/services/userService"

// Use Mock implementation for UserRepository dependency of UserService
vi.mock("../../repositories/userRepository", async () => {
	const { MockUserRepository } = await vi.importActual<
		typeof import("$lib/server/repositories/userRepository")
	>("$lib/server/repositories/userRepository")
	return {
		UserRepository: MockUserRepository
	}
})

describe.concurrent("userService", () => {
	let userService: IUserService

	beforeAll(() => {
		userService = new UserService()
	})

	it("initializes", () => {
		expect(userService).toBeInstanceOf(UserService)
	})

	describe("createUser", () => {
		const createUserPayload: UserCreateDto = {
			id: "mock-id",
			username: "mock-username",
			hashedPassword: "mock-password"
		}

		it("returns true if the user was created", async () => {
			const result = await userService.createUser(createUserPayload)

			expect(result).toBe(true)
		})

		it("returns false if the repository raises UserAlreadyExistsError", async () => {
			vi.spyOn(UserRepository.prototype, "createUser").mockImplementationOnce(() => {
				throw new UserAlreadyExistsError()
			})

			const result = await userService.createUser(createUserPayload)

			expect(result).toBe(false)
		})

		it("throws an error if the repository raises an unexpected error", async () => {
			vi.spyOn(UserRepository.prototype, "createUser").mockImplementationOnce(() => {
				throw new Error("mock-error")
			})

			await expect(userService.createUser(createUserPayload)).rejects.toThrow("mock-error")
		})
	})

	describe("getUserByUsername", () => {
		it("returns a user DTO with correct data", async () => {
			const username = "foobar"
			const user = await userService.getUserByUsername(username)

			expect(user).toEqual({
				id: "mock-id",
				username,
				hashedPassword: "mock-password"
			} as UserDto)
		})

		it("returns null if the repository raises UserNotFoundError", async () => {
			vi.spyOn(UserRepository.prototype, "getUserByUsername").mockImplementationOnce(() => {
				throw new UserNotFoundError()
			})

			const user = await userService.getUserByUsername("foobar")
			expect(user).toBeNull()
		})

		it("throws an error if the repository raises an unexpected error", async () => {
			vi.spyOn(UserRepository.prototype, "getUserByUsername").mockImplementationOnce(() => {
				throw new Error("mock-error")
			})

			await expect(userService.getUserByUsername("foobar")).rejects.toThrow("mock-error")
		})
	})

	describe("getUserById", () => {
		it("returns a user DTO with correct data", async () => {
			const id = "mock-id"
			const user = await userService.getUserById(id)
			expect(user).toEqual({
				id,
				username: "mock-username",
				hashedPassword: "mock-password"
			} as UserDto)
		})
		it("returns null if the repository raises UserNotFoundError", async () => {
			vi.spyOn(UserRepository.prototype, "getUserById").mockImplementationOnce(() => {
				throw new UserNotFoundError()
			})
			const user = await userService.getUserById("mock-id")
			expect(user).toBeNull()
		})

		it("throws an error if the repository raises an unexpected error", async () => {
			vi.spyOn(UserRepository.prototype, "getUserById").mockImplementationOnce(() => {
				throw new Error("mock-error")
			})
			await expect(userService.getUserById("mock-id")).rejects.toThrow("mock-error")
		})
	})
})
