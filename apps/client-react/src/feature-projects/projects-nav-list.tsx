import { NavLink } from "react-router-dom";

import type { Project } from "@projectsbuild/shared/projects";
import For from "~/components/for";

import styles from "./projects-nav-list.module.css";

type ProjectNavListProps = { projects?: Project[] };
export default function ProjectNavList(props: ProjectNavListProps) {
	if (!props.projects || props.projects.length === 0)
		return <div className={styles.projectsNavListEmpty}>No Projects Exist</div>;

	return (
		<nav className={styles.projectsNavList}>
			<For array={props.projects} getKey={(project) => project.id}>
				{(project) => (
					<NavLink
						className={({ isActive }) => (isActive ? styles.activeLink : "")}
						to={`/projects/${project.id}`}
					>
						<span>{project.name}</span>
					</NavLink>
				)}
			</For>
		</nav>
	);
}
