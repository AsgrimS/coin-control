const TYPES = {
	UserRepository: Symbol.for("UserRepository"),
	BudgetRepository: Symbol.for("BudgetRepository"),

	// Commands
	CreateUserCommand: Symbol.for("CreateUserCommand"),
	CreateBudgetCommand: Symbol.for("CreateBudgetCommand"),

	// Queries
	FindUserByUsernameQuery: Symbol.for("FindUserByUsernameQuery"),
	FindBudgetByIdQuery: Symbol.for("FindBudgetByIdQuery"),
	FindBudgetsByOwnerIdQuery: Symbol.for("FindBudgetsByOwnerIdQuery")
}

export { TYPES }
