import type { Result } from "./results"

export interface ICommand<T> {
	execute(payload: T): Promise<Result<void, string>>
}
