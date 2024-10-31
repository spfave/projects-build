import * as React from "react";
import { NavLink } from "react-router-dom";

import type { Project } from "@projectsbuild/shared/projects";
import For from "~/components/for";

import styles from "./projects-nav-list.module.css";

// type ProjectListProps = { projects: Project[] };
// export default function ProjectList(props: ProjectListProps) {
// 	if (props.projects.length === 0)
// 		return <div className={styles.projectsNavListEmpty}>No Projects Exist</div>;

// 	return (
// 		<nav className={styles.projectsNavList}>
// 			<For array={props.projects} getKey={(project) => project.id}>
// 				{(project) => (
// 					<NavLink
// 						className={({ isActive }) => (isActive ? styles.activeLink : "")}
// 						to={`/projects/${project.id}`}
// 					>
// 						<span>{project.name}</span>
// 					</NavLink>
// 				)}
// 			</For>
// 		</nav>
// 	);
// }

type ProjectNavListProps = { projects: Project[] | null; fetchProjects: () => void };
export default function ProjectNavList(props: ProjectNavListProps) {
	React.useEffect(() => {
		props.fetchProjects();
	}, [props.fetchProjects]);

	if (!props.projects) {
		return (
			<div>
				<span>loading...</span>
			</div>
		);
	}

	if (props.projects.length === 0)
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
