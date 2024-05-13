import * as React from "react";
import { Link, Outlet } from "react-router-dom";

import type { Project } from "@projectsbuild/types";

import styles from "./projects-route.module.css";

async function getProjects() {
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects`);

	// if (!res.ok) throw new Error("Fetch to Get Projects failed");
	// if (res.status)

	return res.json();
}

export default function ProjectsRoute() {
	const [projects, setProjects] = React.useState<Project[] | null>(null);

	React.useEffect(() => {
		getProjects().then((data) => setProjects(data));
	}, []);

	if (projects == null) return <div>Loading Projects...</div>;

	if (projects.length === 0) return <div>Create a Project to get started</div>;

	return (
		<div className={styles.projects}>
			<div className={styles.projectsSidebar}>
				<nav>
					{projects?.map((project) => (
						<Link key={project.id} to={project.id.toString()}>
							{project.name}
						</Link>
					))}
				</nav>
			</div>
			<div className={styles.projectsOutlet}>
				<Outlet />
			</div>
		</div>
	);
}
