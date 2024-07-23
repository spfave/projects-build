import { isValidYMD, isYMD, valueIfTruthy, ymdToday } from "@projectsbuild/library/utils";
import { isStringParsableInt } from "@projectsbuild/library/validation";
import type { Project, ProjectErrors, ProjectFields } from "./types";

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
	if (!input || Array.isArray(input) || typeof input !== "object") {
		errors.form.push("Invalid project input");
		return { status: "error", errors } as const;
	}

	const { name, link, description, notes, status, dateCompleted, rating, recommend } =
		input;

	// validate fields
	// name
	if (name == null) errors.fields.name.push("Name must be provided");
	else if (typeof name !== "string") errors.fields.name.push("Name must be a string");
	else if (name.trim().length < 2)
		errors.fields.name.push("Name must be at least 2 characters");

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
	else if (
		typeof status !== "string" ||
		!["planning", "building", "complete"].includes(status)
	) {
		errors.fields.status.push("Invalid status option");
	}

	if (status === "complete") {
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
		else if (
			// biome-ignore format: maintain condition checks on single line
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
	}

	const hasErrors =
		errors.form.length || Object.values(errors.fields).some((fields) => fields.length);

	if (hasErrors) return { status: "error", errors } as const;
	return { status: "valid" } as const;
}

export function transformProject(
	input: ProjectFields,
	action: "create" | "update" = "create"
) {
	const project = {} as Project;

	if (action === "update") project.id = input.id;
	project.name = input.name.trim();
	project.link = valueIfTruthy(input.link?.trim());
	project.description = valueIfTruthy(input.description?.trim());
	project.notes = valueIfTruthy(input.notes?.trim());
	project.status = input.status;

	if (input.status === "complete" && project.status === "complete") {
		project.dateCompleted = input.dateCompleted;
		project.rating = Number(input.rating);
		project.recommend = input.recommend === "true";
	}

	return project;
}
