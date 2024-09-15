// ----------------------------------------------------------------------------------- //
// General Date utilities

/** Object of `Date` formatting methods. */
export const DATE_FORMAT = {
	/**
	 * Formats a `Date` as "day, mth date, year".
	 * @param date
	 * @returns
	 *
	 * @example
	 * pretty(date); // returns Sat, Sept 14, 2024
	 */
	pretty(date: Date) {
		return date.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
			weekday: "short",
		});
	},
	/**
	 * Formats a `Date` as "YYYY-MM-DD".
	 * @param date
	 * @returns
	 *
	 * @example
	 * ymd(date); // returns 2024-09-14
	 */
	ymd(date: Date) {
		const dateYear = date.getFullYear();
		const dateMonth = (date.getMonth() + 1).toString().padStart(2, "0");
		const dateDate = date.getDate().toString().padStart(2, "0");
		return `${dateYear}-${dateMonth}-${dateDate}`;
	},
} as const satisfies Record<string, (date: Date) => string>;
export type DateFormat = keyof typeof DATE_FORMAT;

// ----------------------------------------------------------------------------------- //q
// YYYY-MM-DD Date Utilities

export function ymdParse(ymd: string) {
	const [year, month, day] = ymd.split("-").map(Number) as [number, number, number];
	return new Date(year, month - 1, day);
}

export function ymdPretty(ymd: string) {
	const date = ymdParse(ymd);
	return DATE_FORMAT.pretty(date);
}

export function ymdToday() {
	const date = new Date();
	return DATE_FORMAT.ymd(date);
}

const REGEX_DATE_YMD = /^\d{4}-\d{2}-\d{2}$/;
export function isYMD(ymd: string): boolean {
	return REGEX_DATE_YMD.test(ymd);
}

export function isValidYMD(ymd: string): boolean {
	const date = ymdParse(ymd);
	return DATE_FORMAT.ymd(date) === ymd;
}
