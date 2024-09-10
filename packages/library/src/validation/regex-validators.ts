export const REGEX = Object.freeze({
	DIGITS_ONLY: /^\d+$/,
	DIGITS_ONLY_NON_LEADING_ZERO: /^[1-9]{1}\d*$/,
});

export function isRegex(value: string, regex: keyof typeof REGEX): boolean {
	return REGEX[regex].test(value);
}

export function isDigitsOnlyNonLeadingZero(value: string): boolean {
	return REGEX.DIGITS_ONLY_NON_LEADING_ZERO.test(value);
}
