import * as React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

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
				{projects == null ? <div>loading...</div> : <ProjectsList projects={projects} />}
			</div>
			<div className={styles.projectsOutlet}>
				<Outlet />
			</div>
		</div>
	);
}

function ProjectsList(props: { projects: Project[] }) {
	const { projects } = props;

	if (projects.length === 0) return <div>No Projects Exist</div>;

	return (
		<nav>
			{projects?.map((project) => (
				<NavLink
					className={({ isActive }) => (isActive ? styles.activeLink : "")}
					key={project.id}
					to={`/projects/${project.id}`}
				>
					{project.name}
				</NavLink>
			))}
		</nav>
	);
}
