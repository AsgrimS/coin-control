import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

import Database from 'better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/better-sqlite3';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

export const userTable = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	username: text('username', { length: 64 }).notNull(),
	hashed_password: text('hashed_password', { length: 128 }).notNull()
});

export const sessionTable = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at').notNull()
});

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
