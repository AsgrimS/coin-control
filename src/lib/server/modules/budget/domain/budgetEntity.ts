import { Entity } from "$lib/server/shared/entity"
import type { UserEntity } from "../../user/domain/userEntity"
import type { BudgetAllowanceVO } from "./value-objects/budgetAllowance"
import type { BudgetNameVO } from "./value-objects/budgetName"
import type { ResetDateVO } from "./value-objects/resetDate"
import type { ResetFrequencyVO } from "./value-objects/resetFrequency"

type BudgetEntityProps = {
	id: string
	ownerId: string
	allowance: BudgetAllowanceVO
	resetFrequency: ResetFrequencyVO
	name: BudgetNameVO
	nextResetDate: ResetDateVO
}

export class BudgetEntity extends Entity {
	private constructor(
		protected readonly id: string,
		private readonly ownerId: string,
		private allowance: BudgetAllowanceVO,
		private resetFrequency: ResetFrequencyVO,
		private name: BudgetNameVO,
		private nextResetDate: ResetDateVO
	) {
		super()
	}

	get OwnerId(): string {
		return this.ownerId
	}

	get Allowance(): BudgetAllowanceVO {
		return this.allowance
	}

	get ResetFrequency(): ResetFrequencyVO {
		return this.resetFrequency
	}

	get Name(): BudgetNameVO {
		return this.name
	}

	get NextResetDate(): ResetDateVO {
		return this.nextResetDate
	}

	static from({
		id,
		ownerId,
		allowance,
		resetFrequency,
		name,
		nextResetDate
	}: BudgetEntityProps): BudgetEntity {
		return new BudgetEntity(id, ownerId, allowance, resetFrequency, name, nextResetDate)
	}

	canBeAccessedBy(user: UserEntity): boolean {
		return this.ownerId === user.Id
	}
}
