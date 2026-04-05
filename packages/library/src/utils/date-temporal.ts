// ----------------------------------------------------------------------------------- //
// Temporal Date Utilities

/** Object of `Temporal.PlainDate` formatting methods. */
export const DATE_FORMAT = {
	/**
	 * Formats a `Temporal.PlainDate` as "day, mth date, year".
	 * @param date
	 * @returns
	 *
	 * @example
	 * pretty(date); // returns Sat, Sept 14, 2024
	 */
	pretty(date: Temporal.PlainDate) {
		return date.toLocaleString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
			weekday: "short",
		});
	},
	/**
	 * Formats a `Temporal.PlainDate` as "YYYY-MM-DD".
	 * @param date
	 * @returns
	 *
	 * @example
	 * ymd(date); // returns 2024-09-14
	 */
	ymd(date: Temporal.PlainDate) {
		return date.toString();
	},
} as const satisfies Record<string, (date: Temporal.PlainDate) => string>;
export type DateFormat = keyof typeof DATE_FORMAT;

// ----------------------------------------------------------------------------------- //
// YYYY-MM-DD Date Utilities

export function ymdParse(ymd: string): Temporal.PlainDate {
	return Temporal.PlainDate.from(ymd);
}

export function ymdPretty(ymd: string) {
	try {
		const date = ymdParse(ymd);
		return DATE_FORMAT.pretty(date);
	} catch {
		return "Invalid Date";
	}
}

export function ymdToday() {
	return Temporal.Now.plainDateISO().toString();
}

const REGEX_DATE_YMD = /^\d{4}-\d{2}-\d{2}$/;
export function isYMD(ymd: string): boolean {
	return REGEX_DATE_YMD.test(ymd);
}

export function isValidYMD(ymd: string): boolean {
	try {
		const date = ymdParse(ymd);
		return date.toString() === ymd;
	} catch {
		return false;
	}
}
