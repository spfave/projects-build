import type { FormErrors, FormErrorsAttributes, RecordStr } from "#types";

export function formErrorsAttributes<TForm extends RecordStr>(
	errs?: FormErrors<TForm> | null
) {
	const errsAttrs = {} as FormErrorsAttributes<TForm>;

	const formHasErrors = Boolean(errs?.form?.length) || undefined;
	const formErrorId = formHasErrors ? "error-form" : undefined;
	errsAttrs.form = { id: formErrorId, hasErrors: formHasErrors };

	if (errs) {
		for (const [field, errors] of Object.entries(errs.fields)) {
			const hasErrors = Boolean(errors.length) || undefined;
			const id = hasErrors ? `error-field-${field}` : undefined;
			errsAttrs.fields[field as keyof TForm] = { id, hasErrors };
		}
	}

	return errsAttrs;
}
