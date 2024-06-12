export function ymdPretty(ymd: string) {
	const [year, month, day] = ymd.split("-").map(Number) as [number, number, number];
	const date = new Date(year, month - 1, day);
	return date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
		weekday: "short",
	});
}

export function ymdToday() {
	const date = new Date();
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const dayDate = date.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${dayDate}`;
}
