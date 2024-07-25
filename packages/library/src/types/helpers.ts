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

type HTMLFormFieldElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
// Ref: https://www.epicreact.dev/how-to-type-a-react-form-on-submit-handler
/**
 * Construct a HTMLFormElement type with the properties of TForm matched to HTML form
 * field elements.
 */
export type FormElement<
	TForm extends RecordStr,
	TFormElements extends Record<keyof TForm, HTMLFormFieldElements>,
> = HTMLFormElement & {
	readonly elements: HTMLFormControlsCollection & {
		[Field in keyof TForm]-?: TFormElements[Field];
	};
};

/** Construct a type for TForm with form and form field element error lists. */
export type FormErrors<TForm extends RecordStr> = {
	form: string[];
	fields: { [Field in keyof TForm]-?: string[] };
};

type FormErrorAttributes = { id: string | undefined; hasErrors: true | undefined };
/** Construct a type for TForm with form and form field element error list HTML attributes. */
export type FormErrorsAttributes<TForm extends RecordStr> = {
	form: FormErrorAttributes;
	fields: { [Field in keyof TForm]-?: FormErrorAttributes };
};

export type Maybe<T> = T | null | undefined;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
