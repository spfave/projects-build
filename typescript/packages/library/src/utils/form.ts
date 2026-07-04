import type { FormErrors, FormErrorsAttributes, RecordStr } from "#types";

export function formErrorsAttributes<TForm extends RecordStr>(
	errs?: FormErrors<TForm> | null
) {
	if (!errs) return null;

	const errsAttrs = { form: {}, fields: {} } as FormErrorsAttributes<TForm>;

	const formHasErrors = Boolean(errs?.form?.length) || undefined;
	const formErrorId = formHasErrors ? "error-form" : undefined;
	errsAttrs.form = { id: formErrorId, hasErrors: formHasErrors };

	for (const [field, errors] of Object.entries(errs.fields)) {
		const hasErrors = Boolean(errors.length) || undefined;
		const id = hasErrors ? `error-field-${field}` : undefined;
		errsAttrs.fields[field as keyof TForm] = { id, hasErrors };
	}

	return errsAttrs;
}
