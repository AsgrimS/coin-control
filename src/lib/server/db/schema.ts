import { frequency } from "../..//common"
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

export const userTable = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
	username: text("username", { length: 64 }).notNull(),
	hashed_password: text("hashed_password", { length: 128 }).notNull()
})

export const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull()
})

export const budgetTable = sqliteTable("budget", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	amount: real("amount").notNull(),
	resetFrequency: text("reset_frequency", { enum: frequency }).notNull(),
	nextReset: text("next_reset").notNull(),
	name: text("name", {
		length: 22
	}).notNull()
})

export const transactionTable = sqliteTable("transaction", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	budgetId: text("budget_id")
		.notNull()
		.references(() => budgetTable.id),
	amount: real("amount").notNull(),
	createdAt: text("created_at").notNull(),
	title: text("title", { length: 64 })
})
