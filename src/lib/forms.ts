import { FrequencyEnum } from "./common"
import { Type } from "@sinclair/typebox"

export const signUpSchema = Type.Object({
	username: Type.String({ minLength: 3, maxLength: 64 }),
	password: Type.String({ minLength: 8, maxLength: 128 }),
	repeatPassword: Type.String({ minLength: 8, maxLength: 128 })
})

export const loginSchema = Type.Object({
	username: Type.String({ minLength: 3, maxLength: 64 }),
	password: Type.String({ minLength: 8, maxLength: 128 })
})

export const createBudgetSchema = Type.Object({
	amount: Type.Integer({ minimum: 1, maximum: 1000000 }),
	resetFrequency: Type.Union(
		[Type.Literal(FrequencyEnum.Weekly), Type.Literal(FrequencyEnum.Monthly)],
		{ default: FrequencyEnum.Monthly }
	)
})
