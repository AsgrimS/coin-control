// sort-imports-ignore
import "reflect-metadata"

import type { CreateUserDTO, UserDTO } from "$lib/dtos/user"
import { CreateUserCommand } from "../modules/user/commands/createUserCommand"
import { UserRepository } from "../modules/user/infrastructure/userRepository"
import type { IUserRepository } from "../modules/user/infrastructure/userRepositoryPort"
import { FindUserByUsernameQuery } from "../modules/user/queries/findUserByUsernameQuery"
import type { ICommand } from "../shared/command"
import type { IQuery } from "../shared/query"
import { TYPES } from "./types"
import { Container } from "inversify"
import type { IBudgetRepository } from "../modules/budget/infrastructure/budgetRepositoryPort"
import { BudgetRepository } from "../modules/budget/infrastructure/budgetRepository"
import type { BudgetDTO, CreateBudgetDTO } from "$lib/dtos/budget"
import {
	FindBudgetByIdQuery,
	type FindBudgetByIdQueryPayload
} from "../modules/budget/queries/findBudgetByIdQuery"
import { FindBudgetsByOwnerIdQuery } from "../modules/budget/queries/findBudgetsByOwnerIdQuery"
import { CreateBudgetCommand } from "../modules/budget/commands/createBudgetCommand"
import type { CreateTransactionDTO, RemoveTransactionDTO } from "$lib/dtos/transaction"
import { AddTransactionToBudgetCommand } from "../modules/budget/commands/addTransactionToBudgetCommand"
import { RemoveTransactionFromBudgetCommand } from "../modules/budget/commands/removeTransactionFromBudgetCommand"
import type { IAuthService } from "../services/authServicePort"
import { AuthService } from "../services/authService"

const appContainer = new Container()

// Services
appContainer.bind<IAuthService>(TYPES.AuthService).to(AuthService)

// Repositories
appContainer.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)
appContainer.bind<IBudgetRepository>(TYPES.BudgetRepository).to(BudgetRepository)

// Commands
appContainer.bind<ICommand<CreateUserDTO>>(TYPES.CreateUserCommand).to(CreateUserCommand)
appContainer.bind<ICommand<CreateBudgetDTO>>(TYPES.CreateBudgetCommand).to(CreateBudgetCommand)
appContainer
	.bind<ICommand<CreateTransactionDTO>>(TYPES.AddTransactionToBudgetCommand)
	.to(AddTransactionToBudgetCommand)
appContainer
	.bind<ICommand<RemoveTransactionDTO>>(TYPES.RemoveTransactionFromBudgetCommand)
	.to(RemoveTransactionFromBudgetCommand)

// Queries
appContainer
	.bind<IQuery<string, UserDTO>>(TYPES.FindUserByUsernameQuery)
	.to(FindUserByUsernameQuery)
appContainer
	.bind<IQuery<FindBudgetByIdQueryPayload, BudgetDTO>>(TYPES.FindBudgetByIdQuery)
	.to(FindBudgetByIdQuery)
appContainer
	.bind<IQuery<string, BudgetDTO[]>>(TYPES.FindBudgetsByOwnerIdQuery)
	.to(FindBudgetsByOwnerIdQuery)

export { appContainer }
