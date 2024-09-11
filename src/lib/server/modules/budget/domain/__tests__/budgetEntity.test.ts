import type { UserEntity } from "$lib/server/modules/user/domain/userEntity"
import { DomainError } from "$lib/server/shared/errors"
import { BudgetEntity } from "../budgetEntity"
import { BudgetAllowanceVO } from "../value-objects/budgetAllowance"
import { BudgetNameVO } from "../value-objects/budgetName"
import { ResetDateVO } from "../value-objects/resetDate"
import { ResetFrequencyVO } from "../value-objects/resetFrequency"
import { TransactionVO } from "../value-objects/transaction"
import { getBudgetEntity } from "./budgetUtils"

describe("budgetEntity", () => {
	let budget: BudgetEntity

	beforeEach(() => {
		budget = getBudgetEntity()
	})

	describe("canBeAccessedBy", () => {
		it("should return true if the user is the owner", () => {
			const mockUser = { Id: budget.OwnerId } as UserEntity
			const result = budget.canBeAccessedBy(mockUser)

			expect(result).toBe(true)
		})

		it("should return false if the user is not the owner", () => {
			const mockUser = { Id: "otherId" } as UserEntity
			const result = budget.canBeAccessedBy(mockUser)

			expect(result).toBe(false)
		})
	})

	describe("addExpense", () => {
		it("should add a transaction to the budget", () => {
			assert(budget.Transactions.length === 0)
			const newTransaction = TransactionVO.fromDB({
				id: "newId",
				title: "newTitle",
				amount: 100,
				budgetId: budget.Id,
				createdAt: new Date()
			})

			budget.addExpense(newTransaction)

			expect(budget.Transactions.length).toBe(1)
			expect(budget.Transactions[0]).toBe(newTransaction)
		})
	})

	describe("removeExpense", () => {
		let transactionA: TransactionVO
		let transactionB: TransactionVO
		let budgetWithTransactions: BudgetEntity

		beforeEach(() => {
			transactionA = TransactionVO.fromDB({
				id: "newId",
				title: "newTitle",
				amount: 100,
				budgetId: "id",
				createdAt: new Date()
			})

			transactionB = TransactionVO.fromDB({
				id: "anotherId",
				title: "newTitle",
				amount: 21,
				budgetId: "id",
				createdAt: new Date()
			})

			budgetWithTransactions = BudgetEntity.from({
				id: "id",
				ownerId: "ownerId",
				allowance: BudgetAllowanceVO.fromDB(21),
				name: BudgetNameVO.fromDB("Budget Name"),
				resetFrequency: ResetFrequencyVO.fromDB("monthly"),
				nextResetDate: ResetDateVO.fromDB(new Date()),
				transactions: [transactionA, transactionB]
			})
		})

		it("should remove the specific transaction from the budget", () => {
			assert(budgetWithTransactions.Transactions.length === 2)

			const result = budgetWithTransactions.removeExpense(transactionA)

			assert(result.ok === true)
			expect(budgetWithTransactions.Transactions.length).toBe(1)
			expect(budgetWithTransactions.Transactions[0]).toBe(transactionB)
		})

		it("should return an error if the transaction is not in the budget", () => {
			const transactionNotInBudget = TransactionVO.fromDB({
				id: "notInBudget",
				title: "newTitle",
				amount: 21,
				budgetId: "id",
				createdAt: new Date()
			})

			const result = budgetWithTransactions.removeExpense(transactionNotInBudget)

			expect(budgetWithTransactions.Transactions.length).toBe(2)
			assert(result.ok === false)
			expect(result.error).toBeInstanceOf(DomainError)
			expect(result.error.message).toBe("Transaction does exist not in this budget.")
		})
	})
})
