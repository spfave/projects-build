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
	const keyedArray = array.map((item) => [item, item]);
	return Object.fromEntries(keyedArray) as { [item in TItem]: item };
}

export function arrayToObjectMapUpper<TItem extends string>(array: readonly TItem[]) {
	const keyedArray = array.map((item) => [item.toUpperCase(), item]);
	return Object.fromEntries(keyedArray) as { [item in TItem as Uppercase<item>]: item };
}
