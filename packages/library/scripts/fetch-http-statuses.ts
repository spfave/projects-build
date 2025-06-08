// Ref: https://github.com/w3cj/stoker/blob/main/scripts/update-http-statuses.ts
// Ref: https://github.com/prettymuchbryce/http-status-codes/blob/c840bc674ab043551b87194d1ebb5415f222abbe/scripts/update-codes.ts

import { writeFileSync } from "node:fs";

type HttpStatus = {
	code: number;
	phrase: string;
	constant: string;
	comment: HttpStatusComment;
	isDeprecated?: boolean;
};
type HttpStatusComment = {
	doc: string;
	description: string;
};

function log(string: string) {
	console.log("\x1b[32m%s\x1b[0m", `${string}`);
	// console.log("\x1b[31m%s\x1b[0m", "red");
	// console.log("\x1b[32m%s\x1b[0m", "green");
	// console.log("\x1b[33m%s\x1b[0m", "yellow");
	// console.log("\x1b[34m%s\x1b[0m", "blue");
}

async function fetchHttpStatuses() {
	const filePath = "./src/constants/data/http-statuses.json";

	log("⬇️  Fetching HTTP status data");
	// biome-ignore format: single line
	const res = await fetch("https://raw.githubusercontent.com/prettymuchbryce/http-status-codes/refs/heads/master/codes.json");
	if (!res.ok) throw new Error(`Error retrieving HTTP statuses: ${res.statusText}`);
	const httpStatuses = (await res.json()) as HttpStatus[];
	httpStatuses.sort((s1, s2) => s1.code - s2.code);

	log("📝 Writing HTTP status data to json file");
	const httpStatusesJSON = JSON.stringify(httpStatuses, null, 2);
	writeFileSync(filePath, httpStatusesJSON, { flag: "w" });

	log(`✅ Successfully generated ${filePath}`);
}

fetchHttpStatuses();
