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

const appContainer = new Container()

appContainer.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)

// Commands
appContainer.bind<ICommand<CreateUserDTO>>(TYPES.CreateUserCommand).to(CreateUserCommand)

// Queries
appContainer
	.bind<IQuery<string, UserDTO>>(TYPES.FindUserByUsernameQuery)
	.to(FindUserByUsernameQuery)

export { appContainer }
