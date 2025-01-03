import { type Table, getTableName } from "drizzle-orm";

import { type DB, db } from "#db/db.ts";
import * as schema from "#db/schema.ts";
import projects from "./projects-data.json" with { type: "json" };

if (process.env.DB_SEEDING !== "true")
	throw new Error(`DB_SEEDING must be set to "true" when running DB seed`);

async function resetDBTables() {
	for (const table of [schema.projects, schema.audit]) {
		await db.delete(table);
		// await resetTable(db, table);
	}
	db.$client.execute("VACUUM");
}

async function resetTable(db: DB, table: Table) {
	await db.$client.execute(`DELETE FROM ${getTableName(table)}`);
}

await resetDBTables();
await db.insert(schema.projects).values(projects as schema.ProjectInsert[]);
