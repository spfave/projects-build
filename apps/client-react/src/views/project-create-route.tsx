import * as React from "react";
import { useNavigate } from "react-router-dom";

import type { Project, ProjectInput, ProjectStatus } from "@projectsbuild/types";

import styles from "./project-create-route.module.css";

async function createProject(project: ProjectInput) {
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects`, {
		method: "POST",
		body: JSON.stringify(project),
	});
	const newProject = (await res.json()) as Project;

	return newProject;
}

export default function ProjectCreateRoute() {
	const navigate = useNavigate();
	const [projectStatus, setProjectStatus] = React.useState<ProjectStatus>();

	function handleSelectProjectStatus(evt: React.ChangeEvent<HTMLSelectElement>) {
		setProjectStatus(evt.target.value as ProjectStatus);
	}

	async function handelCreateProject(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const formData = new FormData(evt.currentTarget);
		const formObj = Object.fromEntries(formData.entries()) as ProjectInput;

		const project = await createProject(formObj);
		navigate(`/projects/${project.id}`);
	}

	return (
		<div className={styles.projectCreate}>
			<h2>Define New Project</h2>
			<form method="POST" onSubmit={handelCreateProject}>
				<div className={styles.flexFormGroup}>
					<div>
						<label htmlFor="name" className="block">
							Name
						</label>
						<input id="name" type="text" name="name" />
					</div>
					<div>
						<label htmlFor="link" className="block">
							Link
						</label>
						<input id="link" type="text" name="link" />
					</div>
				</div>
				<div>
					<label htmlFor="description" className="block">
						Description
					</label>
					<textarea id="description" name="description" />
				</div>
				<div>
					<label htmlFor="notes" className="block">
						Notes
					</label>
					<textarea id="notes" name="notes" />
				</div>
				<div className={styles.flexFormGroup}>
					<div>
						<label htmlFor="status" className="block">
							Status
						</label>
						<select
							id="status"
							name="status"
							defaultValue="select"
							value={projectStatus}
							onChange={handleSelectProjectStatus}
						>
							<option value="select" hidden>
								Select a Status
							</option>
							<option value="planning">Planning</option>
							<option value="building">Building</option>
							<option value="complete">Complete</option>
						</select>
					</div>
					{projectStatus === "complete" && (
						<div>
							<label htmlFor="dateCompleted" className="block">
								Date completed
							</label>
							<input id="dateCompleted" type="date" name="dateCompleted" />
						</div>
					)}
				</div>

				{projectStatus === "complete" && (
					<div className={styles.flexFormGroup}>
						<div>
							<label htmlFor="rating" className="block">
								Rating
							</label>
							<input id="rating" type="number" name="rating" min={1} max={5} />
						</div>
						<div>
							<fieldset>
								<legend>Would you recommend</legend>
								<div>
									<span>
										<input
											id="recommend-yes"
											type="radio"
											value="true"
											name="recommend"
										/>
										<label htmlFor="recommend-yes">Yes</label>
									</span>
									<span>
										<input
											id="recommend-no"
											type="radio"
											value="false"
											name="recommend"
										/>
										<label htmlFor="recommend-no">No</label>
									</span>
								</div>
							</fieldset>
						</div>
					</div>
				)}

				<div>
					<button type="submit">Create Project</button>
				</div>
			</form>
		</div>
	);
}
