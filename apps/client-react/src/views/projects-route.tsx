import * as React from "react";
import { Link, Outlet, useOutletContext } from "react-router-dom";

import type { Project } from "@projectsbuild/types";
import { ProjectsList } from "~/feature-projects/projects-nav-list";

import plusIcon from "~/assets/heroicons-plus.svg";
import styles from "./projects-route.module.css";

export async function getProjects() {
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects`);
	// if (!res.ok) throw new FetchError("Fetch to Get Projects failed", { cause: res });
	// if (res.status !== 200) ...

	const projects = (await res.json()) as Project[];
	return projects;
}

type ProjectsContext = { fetchProjects: () => void };

export function useProjectsContext() {
	return useOutletContext<ProjectsContext>();
}

export default function ProjectsRoute() {
	const [projects, setProjects] = React.useState<Project[] | null>(null);

	const fetchProjects = React.useCallback(() => {
		setProjects(null);
		getProjects().then(setProjects);
	}, []);

	React.useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

	return (
		<div className={styles.projects}>
			<div className={styles.projectsSidebar}>
				<div>
					<Link className="action success" to="create" title="new project">
						<p>New Project</p>
						<img height={20} src={plusIcon} alt="" />
					</Link>
				</div>
				<hr />
				<h2>Projects</h2>
				{projects == null ? <div>loading...</div> : <ProjectsList projects={projects} />}
			</div>
			<div className={styles.projectsOutlet}>
				<Outlet context={{ fetchProjects } satisfies ProjectsContext} />
			</div>
		</div>
	);
}
