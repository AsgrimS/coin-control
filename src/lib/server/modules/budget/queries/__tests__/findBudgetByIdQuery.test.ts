// sort-imports-ignore
import "reflect-metadata"

import { TYPES } from "$lib/server/dependencies/types"
import type { IUserRepository } from "$lib/server/modules/user/infrastructure/userRepositoryPort"
import type { IBudgetRepository } from "../../infrastructure/budgetRepositoryPort"
import { FindBudgetByIdQuery } from "../findBudgetByIdQuery"
import { Container } from "inversify"
import { vi } from "vitest"
import { getBudgetEntity } from "../../domain/__tests__/budgetUtils"

describe("findBudgetByIdQuery", () => {
	let findBudgetByIdQuery: FindBudgetByIdQuery
	let mockBudgetRepository: Partial<IBudgetRepository>
	let mockUserRepository: Partial<IUserRepository>
	let container: Container

	const queryPayload = {
		budgetId: "budgetId",
		userId: "userId"
	}

	beforeAll(() => {
		container = new Container()

		container.bind(FindBudgetByIdQuery).toSelf()

		mockBudgetRepository = {
			findOneById: vi.fn()
		}
		mockUserRepository = {
			findOneById: vi.fn()
		}

		container
			.bind<IBudgetRepository>(TYPES.BudgetRepository)
			.toConstantValue(mockBudgetRepository as IBudgetRepository)
		container
			.bind<IUserRepository>(TYPES.UserRepository)
			.toConstantValue(mockUserRepository as IUserRepository)

		findBudgetByIdQuery = container.get(FindBudgetByIdQuery)
	})

	beforeEach(() => {
		mockBudgetRepository.findOneById = vi.fn().mockResolvedValue({})
		mockUserRepository.findOneById = vi.fn().mockResolvedValue({})
	})

	it("should return a budget", async () => {
		const budget = getBudgetEntity()

		budget.canBeAccessedBy = vi.fn().mockReturnValue(true)
		mockBudgetRepository.findOneById = vi.fn().mockResolvedValue(budget)

		const result = await findBudgetByIdQuery.query(queryPayload)

		assert(result.ok === true)
		expect(result.data).toEqual({
			id: "id",
			ownerId: "ownerId",
			allowance: 21,
			name: "Budget Name",
			resetFrequency: "monthly",
			nextReset: expect.any(Date),
			transactions: []
		})
	})

	it("should return an error if the budget does not exist", async () => {
		mockBudgetRepository.findOneById = vi.fn().mockResolvedValue(null)

		const result = await findBudgetByIdQuery.query(queryPayload)

		assert(result.ok === false)
		expect(result.error).toBe("Budget not found")
	})

	it("should return an error if the user does not exist", async () => {
		mockUserRepository.findOneById = vi.fn().mockResolvedValue(null)

		const result = await findBudgetByIdQuery.query(queryPayload)

		assert(result.ok === false)
		expect(result.error).toBe("User performing the query does not exist")
	})

	it("should return an error if user does not have access to budget", async () => {
		mockBudgetRepository.findOneById = vi.fn().mockResolvedValue({
			canBeAccessedBy: vi.fn().mockReturnValue(false)
		})

		const result = await findBudgetByIdQuery.query(queryPayload)

		assert(result.ok === false)
		expect(result.error).toBe("User does not have access to this budget")
	})
})
