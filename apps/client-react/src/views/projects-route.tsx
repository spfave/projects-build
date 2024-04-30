import React from "react";

import type { Project } from "@projectsbuild/types";

import styles from "./page-projects.module.css";

export default function ProjectsRoute() {
	const [projects, setProjects] = React.useState<Project[]>();

	React.useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL_JSON_SERVER}/projects`)
			.then((res) => res.json())
			.then((data: Project[]) => setProjects(data));
	}, []);

	return (
		<div className={styles.projectsContent}>
			<p>Projects Grid</p>
			{JSON.stringify(projects)}
		</div>
	);
}
