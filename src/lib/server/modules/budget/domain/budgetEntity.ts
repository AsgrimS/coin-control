import { Entity } from "$lib/server/shared/entity"
import type { BudgetAllowanceVO } from "./value-objects/budgetAllowance"
import type { ResetDateVO } from "./value-objects/resetDate"
import type { ResetFrequencyVO } from "./value-objects/resetFrequency"

export class BudgetEntity extends Entity {
	constructor(
		protected readonly id: string,
		private ownerId: string,
		private allowance: BudgetAllowanceVO,
		private resetFrequency: ResetFrequencyVO,
		private name: string,
		private nextResetDate: ResetDateVO
	) {
		super()
	}
}
