import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { Project, ProjectStatus } from "@projectsbuild/types";
import { getProjectById } from "./project-route";

import styles from "./project-create-route.module.css";

export async function updateProject(project: Project) {
	const res = await fetch(
		`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects/${project.id}`,
		{
			method: "PUT",
			body: JSON.stringify(project),
		}
	);
	const updatedProject = (await res.json()) as Project;

	return updatedProject;
}

export function formatDateYMD(dateInput: string) {
	const date = new Date(dateInput);
	return date.toISOString().split("T")[0];
}

export default function ProjectEditRoute() {
	const params = useParams();
	const navigate = useNavigate();

	const [, rerender] = React.useState({});
	const [project, setProject] = React.useState<Project | null>(null);
	const [projectStatus, setProjectStatus] = React.useState<ProjectStatus | undefined>();

	const refForm = React.useRef<HTMLFormElement>(null);
	React.useEffect(() => {
		if (!params.id) return;

		setProject(null);
		getProjectById(params.id).then((project) => {
			setProject(project);
			setProjectStatus(project.status);
		});
	}, [params.id]);

	function handleSelectProjectStatus(evt: React.ChangeEvent<HTMLSelectElement>) {
		setProjectStatus(evt.target.value as ProjectStatus);
	}

	async function handelUpdateProject(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const formData = new FormData(evt.currentTarget);
		const formObj = Object.fromEntries(formData.entries()) as Project;
		console.info(`formObj: `, formObj); //LOG

		const project = await updateProject(formObj);
		navigate(`/projects/${project.id}`);
	}

	function handleReset(_evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		_evt.preventDefault();
		refForm.current?.reset();
		setProjectStatus(project?.status);
		rerender({}); // to rerender in case where projectStatus hasn't changed
	}

	return (
		<div className={styles.projectCreate}>
			<h2>Edit Project</h2>
			<form method="POST" onSubmit={handelUpdateProject} ref={refForm}>
				<div>
					<input hidden id="id" type="text" name="id" defaultValue={project?.id} />
				</div>
				<div className={styles.flexFormGroup}>
					<div>
						<label htmlFor="name" className="block">
							Name
						</label>
						<input id="name" type="text" name="name" defaultValue={project?.name} />
					</div>
					<div>
						<label htmlFor="link" className="block">
							Link
						</label>
						<input id="link" type="text" name="link" defaultValue={project?.link} />
					</div>
				</div>
				<div>
					<label htmlFor="description" className="block">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						defaultValue={project?.description}
					/>
				</div>
				<div>
					<label htmlFor="notes" className="block">
						Notes
					</label>
					<textarea id="notes" name="notes" defaultValue={project?.notes} />
				</div>
				<div className={styles.flexFormGroup}>
					<div>
						<label htmlFor="status" className="block">
							Status
						</label>
						<select
							id="status"
							name="status"
							// defaultValue={project?.status}
							value={projectStatus}
							onChange={handleSelectProjectStatus}
						>
							<option hidden>Select Status</option>
							<option value="planning">Planning</option>
							<option value="building">Building</option>
							<option value="complete">Complete</option>
						</select>
					</div>
					{project?.status === "complete" && projectStatus === "complete" && (
						<div>
							<label htmlFor="dateCompleted" className="block">
								Date completed
							</label>
							<input
								id="dateCompleted"
								type="date"
								name="dateCompleted"
								defaultValue={formatDateYMD(project.dateCompleted)}
							/>
						</div>
					)}
				</div>

				{project?.status === "complete" && projectStatus === "complete" && (
					<div className={styles.flexFormGroup}>
						<div>
							<label htmlFor="rating" className="block">
								Rating
							</label>
							<input
								id="rating"
								type="number"
								name="rating"
								min={1}
								max={5}
								defaultValue={project.rating}
							/>
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
											defaultChecked={project.recommend}
										/>
										<label htmlFor="recommend-yes">Yes</label>
									</span>
									<span>
										<input
											id="recommend-no"
											type="radio"
											value="false"
											name="recommend"
											defaultChecked={!project.recommend}
										/>
										<label htmlFor="recommend-no">No</label>
									</span>
								</div>
							</fieldset>
						</div>
					</div>
				)}

				<div className={styles.formActions}>
					<Link to={`/projects/${params.id}`}>Cancel</Link>
					<button type="reset" onClick={handleReset}>
						Revert Changes
					</button>
					<button type="submit">Update Project</button>
				</div>
			</form>
		</div>
	);
}
