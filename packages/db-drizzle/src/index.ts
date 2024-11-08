import { drizzle } from "drizzle-orm/libsql";

import * as schema from "#db/schema.ts";

export const db = drizzle({
	connection: { url: process.env.DB_FILE_NAME },
	casing: "snake_case",
	schema,
	logger: process.env.NODE_ENV === "development",
});
