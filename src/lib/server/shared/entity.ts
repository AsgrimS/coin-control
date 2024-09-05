export abstract class Entity {
	protected readonly id: string

	get Id(): string {
		return this.id
	}
}
