import type { Result } from "./results"

export interface IQuery<T, U> {
	query(payload: T): Promise<Result<U, string>>
}
