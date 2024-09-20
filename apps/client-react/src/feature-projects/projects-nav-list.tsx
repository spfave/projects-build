import { NavLink } from "react-router-dom";

import type { Project } from "@projectsbuild/shared/projects";

import styles from "./projects-nav-list.module.css";

type ProjectListProps = { projects: Project[] };
export default function ProjectList(props: ProjectListProps) {
	if (props.projects.length === 0)
		return <div className={styles.projectsNavListEmpty}>No Projects Exist</div>;

	return (
		<nav className={styles.projectsNavList}>
			{props.projects?.map((project) => (
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
