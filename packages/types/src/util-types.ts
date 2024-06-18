// biome-ignore lint/complexity/noBannedTypes: create non-nullish type alias
export type NonNullish = {};

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & unknown;

// export type DateString = string;
// export type DateYMD = `${string}-${string}-${string}`;
