export function isParsableInt(value: unknown): boolean {
	if (typeof value === "number") return Number.isSafeInteger(value);
	if (typeof value === "string") return isStringParsableInt(value);
	return false;
}

export function isStringParsableInt(value: string): boolean {
	return Number(value) === Number.parseInt(value, 10);
}
