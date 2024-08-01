import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { formErrorsAttributes, ymdToday } from "@projectsbuild/library/utils";
import { transformProject, validateProject } from "@projectsbuild/shared/projects";
import type {
	Project,
	ProjectErrors,
	ProjectFields,
	ProjectInput,
	ProjectStatus,
} from "@projectsbuild/shared/projects";
import { ErrorList } from "~/components/error-list";
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
	const { form: errAttrForm, fields: errAttrFields } =
		formErrorsAttributes(projectErrors) || {};
	const { form: errForm, fields: errFields } = projectErrors || {};

	return (
		<div className={styles.projectCreate}>
			<h2>New Project</h2>
			<form
				ref={refForm}
				method="POST"
				onSubmit={handleCreateProject}
				noValidate={isHydrated}
				aria-invalid={errAttrForm?.hasErrors}
				aria-describedby={errAttrForm?.id}
				tabIndex={-1}
			>
				<div className={styles.formFlexGroup}>
					<div>
						<label htmlFor="name">Name</label>
						<input
							id="name"
							type="text"
							name="name"
							required
							minLength={2}
							aria-invalid={errAttrFields?.name.hasErrors}
							aria-describedby={errAttrFields?.name.id}
						/>
						<div>
							<ErrorList id={errAttrFields?.name.id} errors={errFields?.name} />
						</div>
					</div>
					<div>
						<label htmlFor="link">Link</label>
						<input
							id="link"
							type="text"
							name="link"
							aria-invalid={errAttrFields?.link.hasErrors}
							aria-describedby={errAttrFields?.link.id}
						/>
						<div>
							<ErrorList id={errAttrFields?.link.id} errors={errFields?.link} />
						</div>
					</div>
				</div>
				<div>
					<label htmlFor="description">Description</label>
					<textarea
						id="description"
						name="description"
						aria-invalid={errAttrFields?.description.hasErrors}
						aria-describedby={errAttrFields?.description.id}
					/>
					<div>
						<ErrorList
							id={errAttrFields?.description.id}
							errors={errFields?.description}
						/>
					</div>
				</div>
				<div>
					<label htmlFor="notes">Notes</label>
					<textarea
						id="notes"
						name="notes"
						aria-invalid={errAttrFields?.notes.hasErrors}
						aria-describedby={errAttrFields?.notes.id}
					/>
					<div>
						<ErrorList id={errAttrFields?.notes.id} errors={errFields?.notes} />
					</div>
				</div>
				<div className={styles.formFlexGroup}>
					<div>
						<label htmlFor="status">Status</label>
						<select
							id="status"
							name="status"
							required
							value={projectStatus}
							onChange={handleSelectProjectStatus}
							aria-invalid={errAttrFields?.status.hasErrors}
							aria-describedby={errAttrFields?.status.id}
						>
							<option hidden value="">
								Select Status
							</option>
							<option value="planning">Planning</option>
							<option value="building">Building</option>
							<option value="complete">Complete</option>
						</select>
						<div>
							<ErrorList id={errAttrFields?.status.id} errors={errFields?.status} />
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
								aria-invalid={errAttrFields?.dateCompleted.hasErrors}
								aria-describedby={errAttrFields?.dateCompleted.id}
							/>
							<div>
								<ErrorList
									id={errAttrFields?.dateCompleted.id}
									errors={errFields?.dateCompleted}
								/>
							</div>
						</div>
					)}
				</div>

				{projectStatus === "complete" && (
					<div className={styles.formFlexGroup}>
						<div>
							<label htmlFor="rating">Rating</label>
							<input
								id="rating"
								type="number"
								name="rating"
								required
								min={1}
								max={5}
								aria-invalid={errAttrFields?.rating.hasErrors}
								aria-describedby={errAttrFields?.rating.id}
							/>
							<div>
								<ErrorList id={errAttrFields?.rating.id} errors={errFields?.rating} />
							</div>
						</div>
						<div>
							<fieldset
								aria-invalid={errAttrFields?.rating.hasErrors}
								aria-describedby={errAttrFields?.rating.id}
							>
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
							<div>
								<ErrorList
									id={errAttrFields?.recommend.id}
									errors={errFields?.recommend}
								/>
							</div>
						</div>
					</div>
				)}
				<div className={styles.containerErrorList}>
					<ErrorList id={errAttrForm?.id} errors={errForm} />
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
