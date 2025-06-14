import { sql } from "drizzle-orm";
import { check, integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

import {
	PROJECT_ID_LENGTH,
	PROJECT_STATUS,
	PROJECT_STATUSES,
} from "@projectsbuild/core/projects";
import { boolean, timestamps, uuidRandom } from "./schema-type-helpers.ts";

const sqliteTable = sqliteTableCreator((name) => `pb_${name}`);

export const projects = sqliteTable(
	"projects",
	{
		id: uuidRandom({ length: PROJECT_ID_LENGTH }),
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
	// Ref: https://stackoverflow.com/questions/2615477/conditional-sqlite-check-constraint
	(table) => [
		check("chk_name", sql`length(${table.name}) > 1 AND length(${table.name}) <= 125`),
		check("chk_status", sql`${table.status} IN ('planning', 'building', 'complete')`),
		check(
			"chk_dateCompleted",
			sql`(${table.status} == 'complete' AND ${table.dateCompleted} IS NOT NULL) OR (${table.status} != 'complete' AND ${table.dateCompleted} IS NULL)`
		),
		check(
			"chk_rating",
			sql`(${table.status} == 'complete' AND ${table.rating} IS NOT NULL AND ${table.rating} >= 1 AND ${table.rating} <= 5) OR (${table.status} != 'complete' AND ${table.rating} IS NULL)`
		),
		check(
			"chk_recommend",
			sql`(${table.status} == 'complete' AND ${table.recommend} IS NOT NULL) OR (${table.status} != 'complete' AND ${table.recommend} IS NULL)`
		),
	]
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
