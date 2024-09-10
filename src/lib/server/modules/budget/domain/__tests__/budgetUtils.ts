import { BudgetEntity } from "../budgetEntity"
import { BudgetAllowanceVO } from "../value-objects/budgetAllowance"
import { BudgetNameVO } from "../value-objects/budgetName"
import { ResetDateVO } from "../value-objects/resetDate"
import { ResetFrequencyVO } from "../value-objects/resetFrequency"

export const getBudgetEntity = (): BudgetEntity =>
	BudgetEntity.from({
		id: "id",
		ownerId: "ownerId",
		allowance: BudgetAllowanceVO.fromDB(21),
		name: BudgetNameVO.fromDB("Budget Name"),
		resetFrequency: ResetFrequencyVO.fromDB("monthly"),
		nextResetDate: ResetDateVO.fromDB(new Date()),
		transactions: []
	})
