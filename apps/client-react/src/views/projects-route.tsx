import { Link, Outlet, useOutletContext } from "react-router-dom";

import type { Project } from "@projectsbuild/shared/projects";
import GeneralErrorFallback from "~/components/general-error-fallback";
import { SwitchAsync } from "~/components/ui/switch";
import ProjectNavList from "~/feature-projects/projects-nav-list";
import { useQuery } from "~/hooks/use-async";

import plusIcon from "@projectsbuild/shared/assets/heroicons-plus.svg";
import styles from "./projects-route.module.css";

export async function getProjects() {
	// fetch can error: if no connection made
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects`).catch(
		(err) => {
			throw Error("No connection", { cause: err });
		}
	);

	// response 'status' or 'ok' property can indicate an error
	if (res.status >= 400) throw Error("HttpResponseError");
	if (!res.ok) throw new Error("Get Projects fetch failed", { cause: res });

	// json parsing can error: parse error
	const projects = (await res.json()) as Project[];
	return projects;
}

type ProjectsContext = { fetchProjects: () => Promise<Project[]> };
export function useProjectsContext() {
	return useOutletContext<ProjectsContext>();
}

export default function ProjectsRoute() {
	const projects = useQuery(getProjects);

	return (
		<div className={styles.projects}>
			<aside className={styles.projectsSidebar}>
				<div>
					<Link className="action success" to="create">
						<span>New Project</span>
						<img height={20} src={plusIcon} alt="" />
					</Link>
				</div>
				<hr />
				<section>
					<h2>Projects</h2>
					<SwitchAsync
						state={projects.status}
						display={{
							FULFILLED: <ProjectNavList projects={projects.data} />,
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
