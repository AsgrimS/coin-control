interface IError {
	name: string
}

export class UserAlreadyExistsError implements IError {
	name = "UserAlreadyExistsError"
}
