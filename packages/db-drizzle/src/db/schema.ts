import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timeStamp = () => integer({ mode: "timestamp" });
const timeStamps = {
	createdAt: timeStamp()
		.notNull()
		.$default(() => new Date()),
	updatedAt: timeStamp()
		.notNull()
		.$default(() => new Date())
		.$onUpdate(() => new Date()),
};

// Ref: https://stackoverflow.com/questions/2615477/conditional-sqlite-check-constraint
export const projects = sqliteTable(
	"projects",
	{
		// id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
		id: text({ length: 8 }).primaryKey().$default(crypto.randomUUID),
		name: text({}).notNull(),
		link: text(),
		description: text(),
		notes: text(),
		status: text({ enum: ["planning", "building", "complete"] })
			.notNull()
			.default("planning"),
		dateCompleted: text(),
		rating: integer(),
		recommend: integer({ mode: "boolean" }),
		...timeStamps,
	}
	// (table) => ({
	// 	checkName: check("check_name", sql``),
	// 	checkRating: check(
	// 		"check_rating",
	// 		sql`${table.rating} >= 1 AND ${table.rating} <= 5`
	// 	),
	// })
);
