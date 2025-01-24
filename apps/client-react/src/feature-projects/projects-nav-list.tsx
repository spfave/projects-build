import { NavLink } from "react-router";

import For from "~/components/ui/for";
import type { ProjectListItem } from "~/views/projects-route";

import styles from "./projects-nav-list.module.css";

type ProjectNavListProps = { projects?: ProjectListItem[] | null };
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
