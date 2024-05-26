import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import type { Project, ProjectInput, ProjectStatus } from "@projectsbuild/types";

import styles from "./project-create-route.module.css";

export async function createProject(project: ProjectInput) {
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects`, {
		method: "POST",
		body: JSON.stringify(project),
	});
	const newProject = (await res.json()) as Project;

	return newProject;
}

export function ymdToday() {
	const date = new Date();
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const dayDate = date.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${dayDate}`;
}

export default function ProjectCreateRoute() {
	const navigate = useNavigate();
	const [projectStatus, setProjectStatus] = React.useState<ProjectStatus>();

	function handleSelectProjectStatus(evt: React.ChangeEvent<HTMLSelectElement>) {
		setProjectStatus(evt.target.value as ProjectStatus);
	}

	async function handleCreateProject(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const formData = new FormData(evt.currentTarget);
		const formObj = Object.fromEntries(formData.entries()) as ProjectInput;

		const project = await createProject(formObj);
		navigate(`/projects/${project.id}`);
	}

	function handleReset(_evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		setProjectStatus(undefined);
	}

	return (
		<div className={styles.projectCreate}>
			<h2>Define New Project</h2>
			<form method="POST" onSubmit={handleCreateProject}>
				<div>
					<input id="id" hidden type="text" name="id" />
				</div>
				<div className={styles.flexFormGroup}>
					<div>
						<label htmlFor="name">Name</label>
						<input id="name" type="text" name="name" />
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
							value={projectStatus}
							onChange={handleSelectProjectStatus}
						>
							<option hidden>Select Status</option>
							<option value="planning">Planning</option>
							<option value="building">Building</option>
							<option value="complete">Complete</option>
						</select>
					</div>
					{projectStatus === "complete" && (
						<div>
							<label htmlFor="dateCompleted">Date completed</label>
							<input
								id="dateCompleted"
								type="date"
								name="dateCompleted"
								max={ymdToday()}
							/>
						</div>
					)}
				</div>

				{projectStatus === "complete" && (
					<div className={styles.flexFormGroup}>
						<div>
							<label htmlFor="rating">Rating</label>
							<input id="rating" type="number" name="rating" min={1} max={5} />
						</div>
						<div className={styles.divFieldSet}>
							<fieldset>
								<legend>Would you recommend</legend>
								<div>
									<span>
										<input
											id="recommend-yes"
											type="radio"
											name="recommend"
											value="true"
										/>
										<label htmlFor="recommend-yes">Yes</label>
									</span>
									<span>
										<input
											id="recommend-no"
											type="radio"
											name="recommend"
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
					<Link to="/projects">Cancel</Link>
					<button type="reset" onClick={handleReset}>
						Clear Form
					</button>
					<button type="submit">Create Project</button>
				</div>
			</form>
		</div>
	);
}
