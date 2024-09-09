import type { Some } from "$lib/server/shared/results"
import type { BudgetEntity } from "../domain/budgetEntity"

export interface IBudgetRepository {
	findOneById(id: string): Promise<Some<BudgetEntity>>
	findByOwnerId(ownerId: string): Promise<BudgetEntity[]>
	insert(budget: BudgetEntity): Promise<void>
	update(budget: BudgetEntity): Promise<void>
}
