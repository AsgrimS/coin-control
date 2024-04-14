import { drizzle } from 'drizzle-orm/libsql';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { DATABASE_URL, DATABASE_AUTH } from '$env/static/private';

import { createClient } from '@libsql/client';
import { sessionTable, userTable } from './schema';

const client = createClient({
	url: DATABASE_URL,
	authToken: DATABASE_AUTH
});

export const db = drizzle(client);
export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
