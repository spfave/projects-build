import type { RecordStr } from "./aliases.ts";

// Refs:
// https://www.totaltypescript.com/concepts/mapped-type
// https://www.totaltypescript.com/immediately-indexed-mapped-type

// ----------------------------------------------------------------------------------- //
// #region - General Type Helpers

declare const brand: unique symbol;
export type Brand<T, TBrand> = T & { [brand]: TBrand };

// Ref: https://x.com/mattpocockuk/status/1822917967316676787
export type StringOrOptions<T extends string> = T | (string & {});

export type Maybe<T> = T | null | undefined;

export type Pretty<T> = { [K in keyof T]: T[K] } & {};

// #endregion

// ----------------------------------------------------------------------------------- //
// #region - HTML Form Type Helpers

type HTMLFormFieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
// Ref: https://www.epicreact.dev/how-to-type-a-react-form-on-submit-handler
/**
 * Constructs a `HTMLFormElement` type with the property keys of `TForm` paired to a
 * `HTMLFormFieldElement` type.
 */
export type FormElement<
	TForm extends RecordStr,
	TFormFields extends Record<keyof TForm, HTMLFormFieldElement>,
> = HTMLFormElement & {
	readonly elements: HTMLFormControlsCollection & {
		[Field in keyof TForm]-?: TFormFields[Field];
	};
};

/**
 * Constructs a type with the properties of `TForm` converting `non-string` type properties
 * to type `string` as provided by `FormData` values.
 */
export type FormFields<TForm extends RecordStr> = {
	[Field in keyof TForm]: TForm[Field] extends string ? TForm[Field] : string;
};

/** Constructs a type for `TForm` with error message arrays for the form and form fields. */
export type FormErrors<TForm extends RecordStr> = {
	form: string[];
	fields: { [Field in keyof TForm]-?: string[] };
};

type FormErrorAttributes = { id: string | undefined; hasErrors: true | undefined };
/**
 * Constructs a type for `TForm` with 'id' and 'hasError' properties for the form and form fields.
 * To be used for HTML aria 'describedby' and 'invalid' attributes
 */
export type FormErrorsAttributes<TForm extends RecordStr> = {
	form: FormErrorAttributes;
	fields: { [Field in keyof TForm]-?: FormErrorAttributes };
};

// #endregion
