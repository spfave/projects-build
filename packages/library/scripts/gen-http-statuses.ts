import { execSync } from "node:child_process";
import { open } from "node:fs/promises";
import json from "../src/constants/data/http-statuses.json" with { type: "json" };

// Note: Http status constant definition format
// /**
//  * <deprecated>
//  * <official doc>
//  * <description>
//  */
// export const <constant> = { code: <status code>, phrase: <status phrase>} as const;

const httpStatuses = json;
const filePath = "./src/constants/http-status.ts";
const fileHeader = `// Generated file. Do not edit\n// Created on ${new Date().toDateString()}\n\n`;

generateHttpStatusConstants();

// ----------------------------------------------------------------------------------- //
// Note: implementation using `using` statement
// Ref: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html
// Ref: https://www.totaltypescript.com/typescript-5-2-new-keyword-using

async function generateHttpStatusConstants() {
	console.log("\x1b[32m%s\x1b[0m", "📝 Writing HTTP status data to ts file");

	await using file = await getFileHandle(filePath, "w");
	await file.filehandle.writeFile(fileHeader);

	for (const status of httpStatuses) {
		const statusJSDoc = `
			/**
			 * ${status.isDeprecated ? "@deprecated" : ""}
			 * ${status.comment.doc}
			 * ${status.comment.description.split("\n").join("\n* - ")}
			 */`;
		await file.filehandle.writeFile(statusJSDoc);

		const statusVar = `
			export const ${status.constant} = { 
				code: ${status.code}, 
				phrase: "${status.phrase}",
			} as const;\n
		`;
		await file.filehandle.writeFile(statusVar);
	}
	execSync(`pnpm biome format --write ${filePath}`);

	console.log("\x1b[32m%s\x1b[0m", `✅ Successfully generated ${filePath}`);
}

async function getFileHandle(path: string, mode: "r" | "w" | "a" = "r") {
	const filehandle = await open(path, mode);

	return {
		filehandle,
		[Symbol.asyncDispose]: async () => {
			await filehandle.close();
		},
	};
}

// ----------------------------------------------------------------------------------- //
// Note: implementation using open() and file.close explicitly

// async function generateHttpStatusConstants() {
// 	console.log("\x1b[32m%s\x1b[0m", "📝 Writing HTTP status data to ts file");
// 	const file = await open(filePath, "w");
// 	await file.writeFile(fileHeader);

// 	for (const status of httpStatuses) {
//    ...
// 	}
// 	execSync(`pnpm biome format --write ${filePath}`);

// 	await file.close();
// 	console.log("\x1b[32m%s\x1b[0m", `✅ Successfully generated ${filePath}`);
// }
