import { eq } from "drizzle-orm";

import { db } from "#db/db.ts";
import * as schema from "#db/schema.ts";
import * as ds from "./data-services/projects.ts";

// Projects
const [p1] = await db
	.insert(schema.projects)
	.values({
		name: "a234567890",
		status: "planning",
		// dateCompleted: new Date().toISOString(),
		// rating: 1,
		// recommend: false,
	})
	.returning()
	.catch((err) => {
		console.info(`\n.catch ERROR`); //LOG
		console.info(`err.name: `, err.name); //LOG
		console.info(`err.message: `, err.message); //LOG
		console.info(`\nerr: `, err); //LOG
		return [];
	});
console.info(`p1: `, p1, `\n`); //LOG

try {
	const [p2] = await ds.insertProject({
		name: "b2",
		status: "complete",
		dateCompleted: new Date().toISOString(),
		rating: 4,
		recommend: true,
	});
	console.info(`p2: `, p2, `\n`); //LOG
} catch (err) {
	console.info(`\ntry-catch ERROR`); //LOG
	console.info(`\nerr: `, err); //LOG
}

// Audit
// const [tmp1] = await db
// 	.insert(schema.audit)
// 	.values({
// 		text: `Init: ${Math.floor(Math.random() * 10)}`,
// 	})
// 	.returning();
// console.log("\ntmp1: ", tmp1);

// await new Promise((resolve) => setTimeout(resolve, 1500));
// const tmp2 = await db
// 	.update(schema.audit)
// 	.set({
// 		text: `Mod: ${Math.floor(Math.random() * 10)}`,
// 	})
// 	.where(eq(schema.audit.id, tmp1.id))
// 	.returning();
// console.log("\ntmp2: ", tmp2);
