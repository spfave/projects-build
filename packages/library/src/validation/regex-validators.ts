export const REGEX = {
	DIGITS_ONLY: /^\d+$/,
	DIGITS_ONLY_NON_LEADING_ZERO: /^[1-9]{1}\d*$/,
	// URL: ,
	// URL_IMAGE: ,
} as const satisfies Record<string, RegExp>;

export function isRegex(value: string, regex: keyof typeof REGEX): boolean {
	return REGEX[regex].test(value);
}

export function isDigitsOnlyNonLeadingZero(value: string): boolean {
	return REGEX.DIGITS_ONLY_NON_LEADING_ZERO.test(value);
}
