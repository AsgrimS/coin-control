import { TypeRegistry, Kind, type TSchema, type NumberOptions, ValueGuard } from "@sinclair/typebox"
import { Decimal } from "decimal.js"

export const frequency = ["weekly", "monthly"] as const
export type Frequency = (typeof frequency)[number]
export enum FrequencyEnum {
	Weekly = "weekly",
	Monthly = "monthly"
}

// -----------------------------------------------------------------
// Type: Decimal
// -----------------------------------------------------------------
export interface TDecimal extends TSchema, NumberOptions {
	[Kind]: "Decimal"
	type: "number"
	static: number
}
export function TypeDecimal(options: NumberOptions = {}): TDecimal {
	return { ...options, [Kind]: "Decimal", type: "number" } as never
}
TypeRegistry.Set<TDecimal>("Decimal", (schema, value) => {
	return (
		ValueGuard.IsNumber(value) &&
		(ValueGuard.IsNumber(schema.multipleOf)
			? Decimal.mod(value, schema.multipleOf).eq(new Decimal(0))
			: true) &&
		(ValueGuard.IsNumber(schema.exclusiveMaximum) ? value < schema.exclusiveMaximum : true) &&
		(ValueGuard.IsNumber(schema.exclusiveMinimum) ? value > schema.exclusiveMinimum : true) &&
		(ValueGuard.IsNumber(schema.maximum) ? value <= schema.maximum : true) &&
		(ValueGuard.IsNumber(schema.minimum) ? value >= schema.minimum : true)
	)
})
