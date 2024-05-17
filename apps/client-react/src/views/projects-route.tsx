import * as React from "react";
import { Link, Outlet } from "react-router-dom";

import type { Project } from "@projectsbuild/types";

import plusIcon from "~/assets/heroicons-plus.svg";
import styles from "./projects-route.module.css";

async function getProjects() {
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects`);
	// if (!res.ok) throw new FetchError("Fetch to Get Projects failed", { cause: res });
	// if (res.status !== 200) ...

	const projects = (await res.json()) as Project[];
	return projects;
}

export default function ProjectsRoute() {
	const [projects, setProjects] = React.useState<Project[] | null>(null);

	React.useEffect(() => {
		setProjects(null);
		getProjects().then(setProjects);
	}, []);

	if (projects == null) return <div>Loading Projects...</div>;

	if (projects.length === 0) return <div>Create a Project to get started</div>;

	return (
		<div className={styles.projects}>
			<div className={styles.projectsSidebar}>
				<div>
					<p>Create Project</p>
					<Link to="create" title="create project">
						<img height={24} src={plusIcon} alt="" />
					</Link>
				</div>
				<hr />
				<nav>
					{projects.map((project) => (
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
