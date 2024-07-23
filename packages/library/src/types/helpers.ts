import type { RecordStr } from "./aliases";

/* Refs:
- https://www.totaltypescript.com/concepts/mapped-type
- https://www.totaltypescript.com/immediately-indexed-mapped-type
*/

declare const brand: unique symbol;
export type Brand<T, TBrand> = T & { [brand]: TBrand };

/**
 * Construct a type with the properties of TForm, converts non-string property values
 * to string as provided by HTML form field elements.
 */
export type FormFields<TForm extends RecordStr> = {
	[Field in keyof TForm]: TForm[Field] extends string ? TForm[Field] : string;
};

/** Construct a type for TForm with form and form field element error lists. */
export type FormErrors<TForm extends RecordStr> = {
	form: string[];
	fields: { [Field in keyof TForm]-?: string[] };
};

export type Maybe<T> = T | null | undefined;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
