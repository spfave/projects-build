import { NavLink } from "react-router-dom";

import type { Project } from "@projectsbuild/shared/types";

import styles from "./projects-nav-list.module.css";

export function ProjectsList(props: { projects: Project[] }) {
	const { projects } = props;

	if (projects.length === 0)
		return <div className={styles.projectsNavListEmpty}>No Projects Exist</div>;

	return (
		<nav className={styles.projectsNavList}>
			{projects?.map((project) => (
				<NavLink
					className={({ isActive }) => (isActive ? styles.activeLink : "")}
					key={project.id}
					to={`/projects/${project.id}`}
				>
					<span>{project.name}</span>
				</NavLink>
			))}
		</nav>
	);
}
