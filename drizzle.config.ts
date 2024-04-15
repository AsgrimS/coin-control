import type { Config } from "drizzle-kit"

const { DATABASE_URL, DATABASE_AUTH } = process.env
if (!DATABASE_URL || !DATABASE_AUTH) {
	throw new Error("DATABASE_URL and DATABASE_AUTH must be set in the environment")
}

export default {
	schema: "./src/lib/server/db/schema.ts",
	out: "./drizzle",
	driver: "turso",
	dbCredentials: {
		url: DATABASE_URL,
		authToken: DATABASE_AUTH
	}
} satisfies Config
