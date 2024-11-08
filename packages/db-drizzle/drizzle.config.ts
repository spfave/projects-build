// using dotenvx temporarily for env loading: https://github.com/drizzle-team/drizzle-orm/discussions/3405
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DB_FILE_NAME,
	},
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	casing: "snake_case",
	strict: true,
	verbose: true,
});
