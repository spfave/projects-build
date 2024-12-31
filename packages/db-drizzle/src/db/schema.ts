import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { PROJECT_STATUS, PROJECT_STATUSES } from "@projectsbuild/shared/projects";
import { boolean, timestamps, uuidRandom } from "./schema-type-helpers.ts";

// Ref: https://stackoverflow.com/questions/2615477/conditional-sqlite-check-constraint
export const projects = sqliteTable(
	"projects",
	{
		id: uuidRandom(),
		name: text().notNull(),
		link: text(),
		description: text(),
		notes: text(),
		status: text({ enum: PROJECT_STATUSES }).notNull().default(PROJECT_STATUS.planning),
		dateCompleted: text(),
		rating: integer(),
		recommend: boolean(),
		...timestamps,
	},
	(table) => [
		check("chk_name", sql`length(${table.name}) > 1 AND length(${table.name}) <= 10`),
		check("chk_status", sql`${table.status} IN ('planning', 'building', 'complete')`),
	]
	// (table) => ({
	// 	checkName: check("check_name", sql``),
	// 	checkRating: check(
	// 		"check_rating",
	// 		sql`${table.rating} >= 1 AND ${table.rating} <= 5`
	// 	),
	// })
);

export type ProjectSelect = typeof projects.$inferSelect;
export type ProjectInsert = Omit<
	typeof projects.$inferInsert,
	"id" | "createdAt" | "updatedAt"
>;
export type ProjectUpdate = Partial<ProjectInsert>; //& { id: ProjectSelect["id"] };

// Note: used for testing timestamp schema type helpers
export const audit = sqliteTable("timestamps", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	text: text(),
	numCreatedAt: integer("num_created_at", { mode: "timestamp_ms" }).$default(
		() => new Date()
	),
	numUpdatedAt: integer("num_updated_at", { mode: "timestamp_ms" })
		.$default(() => new Date())
		.$onUpdate(() => new Date()),
	txtCreatedAt: text("txt_created_at").$default(() => new Date().toISOString()),
	txtUpdatedAt: text("txt_updated_at")
		.$default(() => new Date().toISOString())
		.$onUpdateFn(() => new Date().toISOString()),
	...timestamps,
});
