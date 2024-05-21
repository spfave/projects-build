import * as React from "react";
import { useParams } from "react-router-dom";

import type { Project } from "@projectsbuild/types";

import styles from "./project-route.module.css";

async function getProjectById(id: string) {
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects/${id}`);
	const project = (await res.json()) as Project;
	return project;
}

export default function ProjectRoute() {
	const params = useParams();
	const [project, setProject] = React.useState<Project | null>(null);

	React.useEffect(() => {
		setProject(null);
		if (params.id) getProjectById(params.id).then(setProject);
	}, [params.id]);

	if (project == null) return <div>Loading Project...</div>;

	return (
		<div key={project.id} className={styles.project}>
			<h2>{project.name}</h2>
			<p>Status</p>
			<p>{project.status}</p>
			<p>Description</p>
			<p>{project.description}</p>
			<p>Notes</p>
			<p>{project.notes}</p>
			{project.status === "complete" ? (
				<>
					<p>Date Completed</p>
					<p>{new Date(project.dateCompleted).toDateString()}</p>
					<p>Build Rating</p>
					<p>{project.rating}</p>
					<p>Recommend Build</p>
					<p>{project.recommend ? "Yes" : "No"}</p>
				</>
			) : null}
		</div>
	);
}
