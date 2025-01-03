/**
 * Transforms an array of strings to a mapping object with key/value pairs matching the
 * array items.
 * @param array Array of strings
 * @returns Mapping object with key/value pairs matching array items
 *
 * @example
 * arrayToObjectMap(["a", "b"]); // returns { a: "a", b: "b" }
 */
export function arrayToObjectMap<TItem extends string>(array: readonly TItem[]) {
	const obj = {} as { [item in Array<TItem>[number]]: item };
	for (const item of array) {
		obj[item] = item;
	}
	return obj;
}
