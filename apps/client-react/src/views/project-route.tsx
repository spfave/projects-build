import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ymdPretty } from "@projectsbuild/library/utils";
import type { Project } from "@projectsbuild/shared/projects";
import Show from "~/components/show";
import { useProjectsContext } from "./projects-route";

import styles from "./project-route.module.css";

export async function getProjectById(id: string) {
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects/${id}`);
	const project = (await res.json()) as Project;
	return project;
}

export async function deleteProjectById(id: string) {
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects/${id}`, {
		method: "DELETE",
	});
	const deletedProject = (await res.json()) as Project;
	return deletedProject;
}

export default function ProjectRoute() {
	const params = useParams();
	const navigate = useNavigate();
	const [project, setProject] = React.useState<Project | null>(null);
	const { fetchProjects } = useProjectsContext();

	React.useEffect(() => {
		if (!params.id) return;

		setProject(null);
		getProjectById(params.id).then(setProject);
	}, [params.id]);

	async function handleDeleteProject(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		if (!params.id) return;

		await deleteProjectById(params.id);
		fetchProjects();
		navigate("/projects");
	}

	if (project == null) return <div>Loading Project...</div>;

	return (
		<section key={project.id} className={styles.project}>
			<h2>{project.name}</h2>
			<dl className={styles.projectContent}>
				<div>
					<dt>Status</dt>
					<dd>{project.status}</dd>
				</div>
				<div>
					<dt>Link</dt>
					<dd>
						<Show when={project.link} fallback={"--"}>
							<a href={project.link} target="_blank" rel="noreferrer">
								{project.link}
							</a>
						</Show>
					</dd>
				</div>
				<div>
					<dt>Description</dt>
					<dd>{project.description || "--"}</dd>
				</div>
				<div>
					<dt>Notes</dt>
					<dd>{project.notes || "--"}</dd>
				</div>
				<Show when={project.status === "complete" ? project : false}>
					{(project) => (
						<>
							<div>
								<dt>Date Completed</dt>
								<dd>
									<time dateTime={project.dateCompleted}>
										{ymdPretty(project.dateCompleted)}
									</time>
								</dd>
							</div>
							<div>
								<dt>Build Rating</dt>
								<dd>{project.rating}</dd>
							</div>
							<div>
								<dt>Recommend Build</dt>
								<dd>{project.recommend ? "Yes" : "No"}</dd>
							</div>
						</>
					)}
				</Show>
			</dl>
			<div className={styles.projectActions}>
				<Link className="action primary" to="edit">
					Edit
				</Link>
				<form method="POST" onSubmit={handleDeleteProject}>
					<button className="action danger" type="submit" name="intent" value="delete">
						Delete
					</button>
				</form>
			</div>
		</section>
	);
}
