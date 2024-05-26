import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { Project } from "@projectsbuild/types";
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

export function ymdPretty(ymd: string) {
	const [year, month, day] = ymd.split("-").map(Number) as [number, number, number];
	const date = new Date(year, month - 1, day);
	return date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
		weekday: "short",
	});
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
		<div key={project.id} className={styles.project}>
			<section className={styles.projectContent}>
				<h2>{project.name}</h2>
				<p>Status</p>
				<p>{project.status}</p>
				<p>Description</p>
				<p>{project.description || "--"}</p>
				<p>Notes</p>
				<p>{project.notes || "--"}</p>
				{project.status === "complete" ? (
					<>
						<p>Date Completed</p>
						<p>{ymdPretty(project.dateCompleted)}</p>
						<p>Build Rating</p>
						<p>{project.rating}</p>
						<p>Recommend Build</p>
						<p>{project.recommend ? "Yes" : "No"}</p>
					</>
				) : null}
			</section>

			<section className={styles.projectActions}>
				<Link to="edit">Edit</Link>
				<form method="POST" onSubmit={handleDeleteProject}>
					<button type="submit" name="intent" value="delete">
						Delete
					</button>
				</form>
			</section>
		</div>
	);
}
