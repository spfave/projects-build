import type { RecordStr } from "./aliases";

/* Refs:
- https://www.totaltypescript.com/concepts/mapped-type
- https://www.totaltypescript.com/immediately-indexed-mapped-type
*/

declare const brand: unique symbol;
export type Brand<T, TBrand> = T & { [brand]: TBrand };

/**
 * Construct a type with the properties of TObj, converting non-string property values
 * to string as provided by a HTML form field input types.
 */
export type FormFields<TObj extends RecordStr> = {
	[Key in keyof TObj]: TObj[Key] extends string ? TObj[Key] : string;
};

export type Maybe<T> = T | undefined | null;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
