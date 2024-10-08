const TYPES = {
	// Services
	AuthService: Symbol.for("AuthService"),

	// Repositories
	UserRepository: Symbol.for("UserRepository"),
	BudgetRepository: Symbol.for("BudgetRepository"),

	// Commands
	CreateUserCommand: Symbol.for("CreateUserCommand"),
	CreateBudgetCommand: Symbol.for("CreateBudgetCommand"),
	AddTransactionToBudgetCommand: Symbol.for("AddTransactionToBudgetCommand"),
	RemoveTransactionFromBudgetCommand: Symbol.for("RemoveTransactionFromBudgetCommand"),

	// Queries
	FindUserByUsernameQuery: Symbol.for("FindUserByUsernameQuery"),
	FindBudgetByIdQuery: Symbol.for("FindBudgetByIdQuery"),
	FindBudgetsByOwnerIdQuery: Symbol.for("FindBudgetsByOwnerIdQuery")
}

export { TYPES }
