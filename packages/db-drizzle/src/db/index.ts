import { drizzle } from "drizzle-orm/libsql";

import * as schema from "#db/schema.ts";

export const db = drizzle({
	connection: { url: process.env.DB_FILE_NAME },
	casing: "snake_case",
	schema,
	logger: process.env.NODE_ENV === "development",
});
export type DB = typeof db;

// ----------------------------------------------------------------------------------- //
// Note: used for testing timestamp schema type helpers
// const [tmp1] = await db
// 	.insert(schema.timestamps)
// 	.values({
// 		text: `Init: ${Math.floor(Math.random() * 10)}`,
// 	})
// 	.returning();
// console.log("tmp1: ", tmp1?.numCreatedAt?.toLocaleDateString());

// await new Promise((resolve) => setTimeout(resolve, 1937));

// const tmp2 = await db
// 	.update(schema.timestamps)
// 	.set({
// 		text: `Mod: ${Math.floor(Math.random() * 10)}`,
// 	})
// 	.where(eq(schema.timestamps.id, tmp1!.id))
// 	.returning();
// console.log("tmp2: ", tmp2);
