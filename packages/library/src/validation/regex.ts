/** Object of `RegExp` (regular expression) patterns. */
export const REGEXPS = {
	DIGITS_ONLY: /^\d+$/,
	DIGITS_ONLY_NON_LEADING_ZERO: /^[1-9]{1}\d*$/,
	// URL: ,
	// URL_IMAGE: ,
} as const satisfies Record<string, RegExp>;

/**
 * Evaluates if a `string` contains a regular expression pattern.
 * @param value `string` to perform search against
 * @param regexp Predefined regexp key or custom `RegExp`
 * @returns `boolean` determination of regexp match
 */
export function isRegexp(value: string, regexp: keyof typeof REGEXPS | RegExp): boolean {
	if (regexp instanceof RegExp) return regexp.test(value);
	return REGEXPS[regexp].test(value);
}

export function isDigitsOnlyNonLeadingZero(value: string): boolean {
	return REGEXPS.DIGITS_ONLY_NON_LEADING_ZERO.test(value);
}
