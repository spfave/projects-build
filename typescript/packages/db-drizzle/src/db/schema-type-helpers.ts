import { integer, text } from "drizzle-orm/sqlite-core";

// ----------------------------------------------------------------------------------- //
// Type: Ids

export function idNumberAutoIncrement(name = "") {
	return integer(name, { mode: "number" }).primaryKey({ autoIncrement: true });
}

type UUIDRandom = { name?: string; length?: number };
export const UUID_DEFAULT_LENGTH = 8;
const uuidRandomDefault: UUIDRandom = { name: "", length: UUID_DEFAULT_LENGTH };
/**
 * Provides a random UUID schema data type.
 * @param length Optional uuid character length. Default is 8, Suggest 4 or more
 * @returns
 */
export function uuidRandom({ name, length } = uuidRandomDefault) {
	return text(name)
		.primaryKey()
		.$default(() => crypto.randomUUID().slice(0, length));
}

// ----------------------------------------------------------------------------------- //
// Type: Aliases
export function boolean(name = "") {
	return integer(name, { mode: "boolean" });
}

// ----------------------------------------------------------------------------------- //
// Type: Timestamps

// Note: as tested 11/8/24
// - If "name" is not provide to timestamp type helpers and it has appended $defaultFn/$onUpdateFn
// functions inserting a new row fails when performed in drizzle-kit studio
// - For an integer timestamp with "name" provided insert/update works in drizzle-kit studio but
// $defaultFn/$onUpdateFn functions do not evaluate on insert or update and value is null
// - For text timestamp with "name" provided insert/update works in drizzle-kit studio but
// $defaultFn function evaluate on insert but $onUpdateFn does not evaluate on update
// - None of these issues are observed if inserting/updating with the drizzle db client
export function timestampNumberMs(name = "") {
	return integer(name, { mode: "timestamp_ms" });
}
export function timestampString(name = "") {
	return text(name);
}

// Note: as tested 11/8/24
// If "name" is not provide to timestamp type helpers with appended $defaultFn/$onUpdateFn
// functions, inserting new rows fails when performed in drizzle-kit studio
export const timestamps = {
	createdAt: timestampNumberMs("created_at").$default(() => new Date()),
	updatedAt: timestampNumberMs("updated_at")
		.$default(() => new Date())
		.$onUpdate(() => new Date()),
};
