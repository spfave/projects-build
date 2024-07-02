import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { isValidYMD, isYMD, valueIfTruthy, ymdToday } from "@projectsbuild/library/utils";
import { isStringParsableInt } from "@projectsbuild/library/validation";
import type {
	Project,
	ProjectForm,
	ProjectInput,
	ProjectStatus,
} from "@projectsbuild/shared/types";
import { useIsHydrated } from "~/hooks/use-is-hydrated";
import { useProjectsContext } from "./projects-route";

import styles from "./project-create-route.module.css";

export async function createProject(project: ProjectInput) {
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects`, {
		method: "POST",
		body: JSON.stringify(project),
	});
	const newProject = (await res.json()) as Project;

	return newProject;
}

export type ProjectErrors = {
	formErrors: string[];
	fieldErrors: {
		id: string[];
		name: string[];
		link: string[];
		description: string[];
		notes: string[];
		status: string[];
		dateCompleted: string[];
		rating: string[];
		recommend: string[];
	};
};
export function validateProject(input: Record<string, FormDataEntryValue>) {
	const errors: ProjectErrors = {
		formErrors: [],
		fieldErrors: {
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
		errors.formErrors.push("Invalid project input");
		return { status: "error", errors } as const;
	}

	const { name, link, description, notes, status, dateCompleted, rating, recommend } =
		input;

	// validate fields
	// name
	if (name == null) errors.fieldErrors.name.push("Name must be provided");
	else if (typeof name !== "string")
		errors.fieldErrors.name.push("Name must be a string");
	else if (name.trim().length < 2)
		errors.fieldErrors.name.push("Name must be at least 2 characters");

	// link
	if (link && typeof link !== "string")
		errors.fieldErrors.link.push("Link must be a string");

	// description
	if (description && typeof description !== "string")
		errors.fieldErrors.description.push("Description must be a string");

	// notes
	if (notes && typeof notes !== "string")
		errors.fieldErrors.notes.push("Notes must be a string");

	// status
	if (status == null) errors.fieldErrors.status.push("Status must be provided");
	else if (
		typeof status !== "string" ||
		!["planning", "building", "complete"].includes(status)
	) {
		errors.fieldErrors.status.push("Invalid status option");
	}

	if (status === "complete") {
		// dateCompleted
		if (dateCompleted == null)
			errors.fieldErrors.dateCompleted.push("Completion date must be provided");
		else if (typeof dateCompleted !== "string")
			errors.fieldErrors.dateCompleted.push("Invalid date type");
		else if (!isYMD(dateCompleted))
			errors.fieldErrors.dateCompleted.push("Invalid format. Use YYYY-MM-DD");
		else if (!isValidYMD(dateCompleted) || dateCompleted > ymdToday())
			errors.fieldErrors.dateCompleted.push("Invalid date");

		// rating
		if (rating == null) errors.fieldErrors.rating.push("Rating must be provided");
		else if (
			// biome-ignore format: maintain condition checks on single line
			(typeof rating === "string" && (!isStringParsableInt(rating) || +rating < 1 || +rating > 5)) ||
			(typeof rating === "number" && (!Number.isInteger(rating) || rating < 0 || rating > 5))
		) {
			errors.fieldErrors.rating.push("Rating must be a whole number 1 through 5");
		}

		// recommend
		if (recommend == null)
			errors.fieldErrors.recommend.push("Recommendation must be provided");
		else if (
			!["boolean", "string"].includes(typeof recommend) ||
			(typeof recommend === "string" && !["true", "false"].includes(recommend))
		)
			errors.fieldErrors.recommend.push("Invalid recommendation");
	}

	const hasErrors =
		errors.formErrors.length ||
		Object.values(errors.fieldErrors).some((fieldErrors) => fieldErrors.length);

	if (hasErrors) return { status: "error", errors } as const;
	return undefined;
}

export function transformProject(
	input: ProjectForm,
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

export default function ProjectCreateRoute() {
	const navigate = useNavigate();
	const { fetchProjects } = useProjectsContext();

	const [projectStatus, setProjectStatus] = React.useState<ProjectStatus>();
	const [projectErrors, setProjectErrors] = React.useState<ProjectErrors | null>(null);

	function handleSelectProjectStatus(evt: React.ChangeEvent<HTMLSelectElement>) {
		setProjectStatus(evt.target.value as ProjectStatus);
	}

	async function handleCreateProject(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const formData = new FormData(evt.currentTarget);
		const formObj = Object.fromEntries(formData.entries());
		const validation = validateProject(formObj);
		if (validation?.status === "error") return setProjectErrors(validation.errors);
		if (projectErrors) setProjectErrors(null);

		const projectPayload = transformProject(formObj as ProjectForm);
		const project = await createProject(projectPayload);

		fetchProjects();
		navigate(`/projects/${project.id}`);
	}

	const isHydrated = useIsHydrated();
	const formErrors = projectErrors?.formErrors;
	const fieldErrors = projectErrors?.fieldErrors;
	const formHasErrors = Boolean(formErrors?.length);
	const formErrorId = formHasErrors ? "error-form" : undefined;
	const nameHasErrors = Boolean(fieldErrors?.name.length);
	const nameErrorId = nameHasErrors ? "error-name" : undefined;
	const linkHasErrors = Boolean(fieldErrors?.link.length);
	const linkErrorId = linkHasErrors ? "error-link" : undefined;
	const descriptionHasErrors = Boolean(fieldErrors?.description.length);
	const descriptionErrorId = descriptionHasErrors ? "error-description" : undefined;
	const notesHasErrors = Boolean(fieldErrors?.notes.length);
	const notesErrorId = notesHasErrors ? "error-notes" : undefined;
	const statusHasErrors = Boolean(fieldErrors?.status.length);
	const statusErrorId = statusHasErrors ? "error-status" : undefined;
	const dateCompletedHasErrors = Boolean(fieldErrors?.dateCompleted.length);
	const dateCompletedErrorId = dateCompletedHasErrors ? "error-dateCompleted" : undefined;
	const ratingHasErrors = Boolean(fieldErrors?.rating.length);
	const ratingErrorId = ratingHasErrors ? "error-rating" : undefined;
	const recommendHasErrors = Boolean(fieldErrors?.recommend.length);
	const recommendErrorId = recommendHasErrors ? "error-recommend" : undefined;

	function handleReset(_evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		setProjectStatus(undefined);
	}

	return (
		<div className={styles.projectCreate}>
			<h2>New Project</h2>
			<form method="POST" onSubmit={handleCreateProject} noValidate={isHydrated}>
				{/* <div>
					<input id="id" hidden type="text" name="id" />
				</div> */}
				<div className={styles.flexFormGroup}>
					<div>
						<label htmlFor="name">Name</label>
						<input
							id="name"
							type="text"
							name="name"
							required
							minLength={2}
							aria-invalid={nameHasErrors || undefined}
							aria-describedby={nameErrorId}
						/>
						<div>
							<ErrorList id={nameErrorId} errors={fieldErrors?.name} />
						</div>
					</div>
					<div>
						<label htmlFor="link">Link</label>
						<input id="link" type="text" name="link" />
					</div>
				</div>
				<div>
					<label htmlFor="description">Description</label>
					<textarea id="description" name="description" />
				</div>
				<div>
					<label htmlFor="notes">Notes</label>
					<textarea id="notes" name="notes" />
				</div>
				<div className={styles.flexFormGroup}>
					<div>
						<label htmlFor="status">Status</label>
						<select
							id="status"
							name="status"
							required
							value={projectStatus}
							onChange={handleSelectProjectStatus}
							aria-invalid={statusHasErrors || undefined}
							aria-describedby={statusErrorId}
						>
							<option hidden value="">
								Select Status
							</option>
							<option value="planning">Planning</option>
							<option value="building">Building</option>
							<option value="complete">Complete</option>
						</select>
						<div>
							<ErrorList id={statusErrorId} errors={fieldErrors?.status} />
						</div>
					</div>
					{projectStatus === "complete" && (
						<div>
							<label htmlFor="dateCompleted">Date completed</label>
							<input
								id="dateCompleted"
								type="date"
								name="dateCompleted"
								required
								max={ymdToday()}
							/>
						</div>
					)}
				</div>

				{projectStatus === "complete" && (
					<div className={styles.flexFormGroup}>
						<div>
							<label htmlFor="rating">Rating</label>
							<input id="rating" type="number" name="rating" required min={1} max={5} />
						</div>
						<div>
							<fieldset>
								<legend>Would you recommend</legend>
								<div>
									<span>
										<input
											id="recommend-yes"
											type="radio"
											name="recommend"
											required
											value="true"
										/>
										<label htmlFor="recommend-yes">Yes</label>
									</span>
									<span>
										<input
											id="recommend-no"
											type="radio"
											name="recommend"
											required
											value="false"
										/>
										<label htmlFor="recommend-no">No</label>
									</span>
								</div>
							</fieldset>
						</div>
					</div>
				)}

				<div className={styles.formActions}>
					<button className="action primary" type="submit">
						Create Project
					</button>
					<button className="action danger outline" type="reset" onClick={handleReset}>
						Clear Form
					</button>
					<Link className="action danger outline" to="/projects">
						Cancel
					</Link>
				</div>
			</form>
		</div>
	);
}

export function ErrorList(props: { id?: string; errors?: string[] | null }) {
	if (!props.errors) return null;

	return (
		<ul id={props.id} className={styles.errorList}>
			{props.errors.map((error) => (
				<li key={error}>{error}</li>
			))}
		</ul>
	);
}
