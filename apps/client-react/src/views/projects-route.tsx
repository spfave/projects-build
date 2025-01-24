import { Link, Outlet, useOutletContext } from "react-router";

import type { Project } from "@projectsbuild/shared/projects";
import GeneralErrorFallback from "~/components/error-fallback";
import { SwitchAsync } from "~/components/ui/switch";
import * as client from "~/feature-projects/client-api-rpc";
import ProjectNavList from "~/feature-projects/projects-nav-list";
import { useQuery } from "~/hooks/use-async";

import plusIcon from "@projectsbuild/shared/assets/heroicons-plus.svg";
import styles from "./projects-route.module.css";

// Note: needed for type inferred rpc client response from get projects endpoint
export type ProjectListItem = Pick<Project, "id" | "name">;
type ProjectsContext = { fetchProjects: () => Promise<ProjectListItem[]> };
export function useProjectsContext() {
	return useOutletContext<ProjectsContext>();
}

export default function ProjectsRoute() {
	const projects = useQuery(client.getProjects);

	return (
		<div className={styles.projects}>
			<aside className={styles.projectsSidebar}>
				<div>
					<Link className="action success" to="create">
						<span>New Project</span>
						<img height={20} src={plusIcon} alt="plus icon" />
					</Link>
				</div>
				<hr />
				<section>
					<h2>Projects</h2>
					<SwitchAsync
						state={projects.status}
						display={{
							FULFILLED: <ProjectNavList projects={projects.data} />,
							IDLE: null,
							PENDING: (
								<div>
									<span>Loading Projects...</span>
								</div>
							),
							ERROR: (
								<div style={{ padding: "1rem" }}>
									<GeneralErrorFallback error={projects.error} />
								</div>
							),
						}}
					/>
				</section>
			</aside>
			<div className={styles.projectsOutlet}>
				<Outlet context={{ fetchProjects: projects.refetch } satisfies ProjectsContext} />
			</div>
		</div>
	);
}
