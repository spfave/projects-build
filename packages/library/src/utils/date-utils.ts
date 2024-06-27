/**
 * Date formatting methods.
 *
 * type = Readonly<Record<DateFormat, (date: Date) => string>>
 */
export const dateFormatter = {
	/**
	 * Return date formatted as 'day, mth date, year'
	 * @param date Date
	 * @returns string
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
	 * Return date formatted as 'yyyy-mm-dd'
	 * @param date Date
	 * @returns string
	 */
	ymd(date: Date) {
		const dateYear = date.getFullYear();
		const dateMonth = (date.getMonth() + 1).toString().padStart(2, "0");
		const dateDate = date.getDate().toString().padStart(2, "0");
		return `${dateYear}-${dateMonth}-${dateDate}`;
	},
} as const;
export type DateFormat = keyof typeof dateFormatter;

export function ymdParse(ymd: string) {
	const [year, month, day] = ymd.split("-").map(Number) as [number, number, number];
	return new Date(year, month - 1, day);
}

export function ymdPretty(ymd: string) {
	const date = ymdParse(ymd);
	return dateFormatter.pretty(date);
}

export function ymdToday() {
	const date = new Date();
	return dateFormatter.ymd(date);
}

const REGEX_DATE_YMD = /^\d{4}-\d{2}-\d{2}$/;
export function isYMD(ymd: string): boolean {
	return REGEX_DATE_YMD.test(ymd);
}

export function isValidYMD(ymd: string): boolean {
	const date = ymdParse(ymd);
	return dateFormatter.ymd(date) === ymd;
}
