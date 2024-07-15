import { TypeDecimal, FrequencyEnum, Nullable } from "./common"
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
	name: Type.String({ minLength: 1, maxLength: 22 }),
	amount: TypeDecimal({ multipleOf: 0.01, minimum: 1, maximum: 1000000, default: null }),
	resetFrequency: Type.Union(
		[Type.Literal(FrequencyEnum.Weekly), Type.Literal(FrequencyEnum.Monthly)],
		{ default: FrequencyEnum.Monthly }
	)
})

export const createTransactionSchema = Type.Object({
	amount: TypeDecimal({ multipleOf: 0.01, minimum: 0.01, maximum: 1000000, default: null }),
	title: Nullable(Type.String({ maxLength: 64, default: null }))
})

export const deleteTransactionSchema = Type.Object({
	transactionId: Type.String()
})
