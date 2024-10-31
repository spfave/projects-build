/**
 * Evaluates if a value of `unknown` type can be parsed to an integer.
 * @param value
 * @returns
 */
export function isParsableInt(value: unknown): boolean {
	if (typeof value === "number") return Number.isSafeInteger(value);
	if (typeof value === "string") return isStringParsableInt(value);
	return false;
}

/**
 * Evaluates if a `string` can be parsed to an integer.
 * @param value
 * @returns
 */
export function isStringParsableInt(value: string): boolean {
	return Number(value) === Number.parseInt(value, 10);
}
