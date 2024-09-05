const TYPES = {
	UserRepository: Symbol.for("UserRepository"),

	// Commands
	CreateUserCommand: Symbol.for("CreateUserCommand"),

	// Queries
	FindUserByUsernameQuery: Symbol.for("FindUserByUsernameQuery")
}

export { TYPES }
