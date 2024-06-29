import { frequency } from "$lib/common"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

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
	amount: integer("amount").notNull(),
	resetFrequency: text("reset_frequency", { enum: frequency }).notNull()
})
