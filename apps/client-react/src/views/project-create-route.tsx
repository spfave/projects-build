import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { ymdToday } from "@projectsbuild/library/utils";
import { transformProject, validateProject } from "@projectsbuild/shared/projects";
import type {
	Project,
	ProjectErrors,
	ProjectFields,
	ProjectInput,
	ProjectStatus,
} from "@projectsbuild/shared/projects";
import { useFocusInvalid } from "~/hooks/use-focus-invalid";
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

export default function ProjectCreateRoute() {
	const navigate = useNavigate();
	const { fetchProjects } = useProjectsContext();

	const refForm = React.useRef<HTMLFormElement>(null);
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
		if (validation.status === "error") return setProjectErrors(validation.errors);
		if (projectErrors) setProjectErrors(null);

		const projectPayload = transformProject(formObj as ProjectFields);
		const project = await createProject(projectPayload);

		fetchProjects();
		navigate(`/projects/${project.id}`);
	}

	function handleReset(_evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		setProjectStatus(undefined);
		setProjectErrors(null);
	}

	// ?? Needs additional condition on hasErrors
	useFocusInvalid(refForm.current, Boolean(projectErrors));
	const isHydrated = useIsHydrated();
	const formErrors = projectErrors?.form;
	const fieldErrors = projectErrors?.fields;
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

	return (
		<div className={styles.projectCreate}>
			<h2>New Project</h2>
			<form
				ref={refForm}
				method="POST"
				onSubmit={handleCreateProject}
				noValidate={isHydrated}
				aria-invalid={formHasErrors || undefined}
				aria-describedby={formErrorId}
				tabIndex={-1}
			>
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
				<div className={styles.containerErrorList}>
					<ErrorList id={formErrorId} errors={formErrors} />
				</div>

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

type ErrorListProps = { id?: string; errors?: string[] };
export function ErrorList(props: ErrorListProps) {
	if (!props.errors) return null;

	return (
		<ul id={props.id} className={styles.errorList}>
			{props.errors.map((error) => (
				<li key={error}>{error}</li>
			))}
		</ul>
	);
}
