import "@total-typescript/ts-reset/array-includes";

import { isValidYMD, isYMD, valueIfTruthy, ymdToday } from "@projectsbuild/library/utils";
import { isStringParsableInt } from "@projectsbuild/library/validation";
import { PROJECT_ID_LENGTH, PROJECT_STATUS, PROJECT_STATUSES } from "./constants.ts";
import type { Project, ProjectErrors, ProjectFields, ProjectInput } from "./types.ts";

export function validateProjectId(id: string | undefined | null) {
	if (!id || typeof id !== "string" || id.length !== PROJECT_ID_LENGTH) {
		return { success: false } as const;
	}
	return { success: true } as const;
}

export function validateProject(input: Record<string, FormDataEntryValue>) {
	const errors: ProjectErrors = {
		form: [],
		fields: {
			id: [],
			name: [],
			link: [],
			description: [],
			notes: [],
			status: [],
			dateCompleted: [],
			rating: [],
			recommend: [],
		},
	};

	// validate input is an object
	if (input == null || Array.isArray(input) || typeof input !== "object") {
		errors.form.push("Invalid project input");
		return { status: "error", errors } as const;
	}

	const { name, link, description, notes, status, dateCompleted, rating, recommend } =
		input;

	// validate fields
	// name
	if (name == null) errors.fields.name.push("Name must be provided");
	else if (typeof name !== "string") errors.fields.name.push("Name must be a string");
	else {
		if (name.trim().length < 2)
			errors.fields.name.push("Name must be at least 2 characters");
		if (name.trim().length > 125)
			errors.fields.name.push("Name cannot be more than 125 characters");
	}

	// link
	if (link && typeof link !== "string") errors.fields.link.push("Link must be a string");

	// description
	if (description && typeof description !== "string")
		errors.fields.description.push("Description must be a string");

	// notes
	if (notes && typeof notes !== "string")
		errors.fields.notes.push("Notes must be a string");

	// status
	if (status == null) errors.fields.status.push("Status must be provided");
	else if (typeof status !== "string" || !PROJECT_STATUSES.includes(status)) {
		errors.fields.status.push("Invalid status option");
	}

	// status dependent
	if (status === PROJECT_STATUS.complete) {
		// dateCompleted
		if (dateCompleted == null)
			errors.fields.dateCompleted.push("Completion date must be provided");
		else if (typeof dateCompleted !== "string")
			errors.fields.dateCompleted.push("Invalid date type");
		else if (!isYMD(dateCompleted))
			errors.fields.dateCompleted.push("Invalid format. Use YYYY-MM-DD");
		else if (!isValidYMD(dateCompleted) || dateCompleted > ymdToday())
			errors.fields.dateCompleted.push("Invalid date");

		// rating
		if (rating == null) errors.fields.rating.push("Rating must be provided");
		else if (!["string", "number"].includes(typeof rating))
			errors.fields.rating.push("Invalid rating type");
		else if (
			// biome-ignore format: single line per type based validation check
			(typeof rating === "string" && (!isStringParsableInt(rating) || +rating < 1 || +rating > 5)) ||
			(typeof rating === "number" && (!Number.isInteger(rating) || rating < 1 || rating > 5))
		) {
			errors.fields.rating.push("Rating must be a whole number 1 through 5");
		}

		// recommend
		if (recommend == null)
			errors.fields.recommend.push("Recommendation must be provided");
		else if (
			!["boolean", "string"].includes(typeof recommend) ||
			(typeof recommend === "string" && !["true", "false"].includes(recommend))
		)
			errors.fields.recommend.push("Invalid recommendation");
	} else {
		if (dateCompleted != null)
			errors.fields.dateCompleted.push("Completion date is not assignable");
		if (rating != null) errors.fields.rating.push("Rating is not assignable");
		if (recommend != null) errors.fields.recommend.push("Recommend is not assignable");
	}

	const hasErrors =
		errors.form.length ||
		Object.values(errors.fields).some((fieldErrs) => fieldErrs.length);

	if (hasErrors) return { status: "error", errors } as const;
	return { status: "valid" } as const;
}

// Define function overloads to specify return type ProjectInput/Project for "create"/"update" action
export function transformProject(
	input: Project | ProjectFields,
	action?: "create"
): ProjectInput;
export function transformProject(
	input: Project | ProjectFields,
	action?: "update"
): Project;
export function transformProject(
	input: Project | ProjectFields,
	action: "create" | "update" = "create"
) {
	const project = {} as Project;

	if (action === "update") project.id = input.id;
	project.name = input.name.trim();
	project.link = valueIfTruthy(input.link?.trim());
	project.description = valueIfTruthy(input.description?.trim());
	project.notes = valueIfTruthy(input.notes?.trim());
	project.status = input.status;

	if (
		input.status === PROJECT_STATUS.complete &&
		project.status === PROJECT_STATUS.complete
	) {
		project.dateCompleted = input.dateCompleted;
		project.rating =
			typeof input.rating === "number" ? input.rating : Number(input.rating);
		project.recommend =
			typeof input.recommend === "boolean" ? input.recommend : input.recommend === "true";
	} else {
		// Set "complete" status fields to null to overwrite existing data if updating from
		// "complete" to "planning/building" status
		// @ts-expect-error
		project.dateCompleted = null;
		// @ts-expect-error
		project.rating = null;
		// @ts-expect-error
		project.recommend = null;
	}

	return project;
}
