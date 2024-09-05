export abstract class ValueObject<T> {
	protected constructor(protected readonly value: T) {}

	get Value(): T {
		return this.value
	}
}
