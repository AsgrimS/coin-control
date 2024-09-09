import type { BudgetDTO, CreateBudgetDTO } from "$lib/dtos/budget"
import type { CreateUserDTO, UserDTO } from "$lib/dtos/user"
import { appContainer } from "./dependencyInjection/inversify.config"
import { TYPES } from "./dependencyInjection/types"
import type { FindBudgetByIdQueryPayload } from "./modules/budget/queries/findBudgetByIdQuery"
import type { ICommand } from "./shared/command"
import type { IQuery } from "./shared/query"

// This file acts as composition root for the application.

// Commands
export const createUserCommand = appContainer.get<ICommand<CreateUserDTO>>(TYPES.CreateUserCommand)
export const createBudgetCommand = appContainer.get<ICommand<CreateBudgetDTO>>(
	TYPES.CreateBudgetCommand
)

// Queries
export const findUserByUsernameQuery = appContainer.get<IQuery<string, UserDTO>>(
	TYPES.FindUserByUsernameQuery
)
export const findBudgetByIdQuery = appContainer.get<IQuery<FindBudgetByIdQueryPayload, BudgetDTO>>(
	TYPES.FindBudgetByIdQuery
)
export const findBudgetsByOwnerIdQuery = appContainer.get<IQuery<string, BudgetDTO[]>>(
	TYPES.FindBudgetsByOwnerIdQuery
)
