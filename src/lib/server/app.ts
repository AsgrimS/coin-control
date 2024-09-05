import type { CreateUserDTO, UserDTO } from "$lib/dtos/user"
import { appContainer } from "./dependencyInjection/inversify.config"
import { TYPES } from "./dependencyInjection/types"
import type { ICommand } from "./shared/command"
import type { IQuery } from "./shared/query"

// This file acts as composition root for the application.

// Commands
export const createUserCommand = appContainer.get<ICommand<CreateUserDTO>>(TYPES.CreateUserCommand)

// Queries
export const findUserByUsernameQuery = appContainer.get<IQuery<string, UserDTO>>(
	TYPES.FindUserByUsernameQuery
)
