import { DATABASE_URL, DATABASE_AUTH } from "$env/static/private"
import { sessionTable, userTable } from "./schema"
import { createClient } from "@libsql/client"
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { drizzle } from "drizzle-orm/libsql"

const client = createClient({
	url: DATABASE_URL || "file:./sqlite.db",
	authToken: DATABASE_AUTH || "secret"
})

export const db = drizzle(client)
export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)
