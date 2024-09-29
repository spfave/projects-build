import * as React from "react";
import { Link, Outlet, useOutletContext } from "react-router-dom";

import type { Project } from "@projectsbuild/shared/projects";
import GeneralErrorFallback from "~/components/general-error-fallback";
import ProjectNavList from "~/feature-projects/projects-nav-list";

import plusIcon from "@projectsbuild/shared/assets/heroicons-plus.svg";
import styles from "./projects-route.module.css";

export async function getProjects() {
	// console.warn(`GET PROJECTS`); //LOG
	// throw new Error("THROW get projects"); // doesn't get caught since async

	// fetch can error: if no connection made
	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects`).catch(
		(err) => {
			console.warn(`GET PROJECTS ERROR CATCH`); //LOG
			console.info(`err: `, err); //LOG
			throw Error("No connection", { cause: err });
		}
	);
	console.info(`res: `, res); //LOG

	// response 'status' or 'ok' property could indicate error
	if (res.status >= 400) throw Error("HttpResponseError");
	if (!res.ok) throw new Error("Get Projects fetch failed", { cause: res });

	// json parsing can error: parse error
	const projects = (await res.json()) as Project[];
	return projects;
}

type ProjectsContext = { fetchProjects: () => void };
export function useProjectsContext() {
	return useOutletContext<ProjectsContext>();
}

type AsyncStatus = "PENDING" | "FULFILLED" | "ERROR";
export default function ProjectsRoute() {
	// const [projects, setProjects] = React.useState<Project[]>();
	const [status, setStatus] = React.useState<AsyncStatus>("PENDING");
	const [data, setData] = React.useState<Project[]>();
	const [error, setError] = React.useState<unknown>(null);

	const fetchProjects = React.useCallback(() => {
		// throw new Error("throw fetch error"); // caught during render
		setStatus("PENDING");
		getProjects()
			.then((data) => {
				// console.warn(`THROW THEN`); //LOG
				// throw new Error("throw fetch THEN"); // doesn't get caught since async
				// setProjects(data);
				setData(data);
				setStatus("FULFILLED");
			})
			.catch((err) => {
				console.warn(`COMPONENT ERROR CATCH`); //LOG
				console.info(`err: `, err); //LOG
				console.info(`err.name: `, err.name); //LOG
				console.info(`err.msg: `, err.message); //LOG
				// throw new Error("throw fetch rejection"); // doesn't get caught since async
				setError(err);
				setStatus("ERROR");
			});
	}, []);

	React.useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

	// throw new Error("throw render error"); // caught during render
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
					{/* <ProjectNavList projects={projects} fetchProjects={fetchProjects} /> */}
					{status === "PENDING" ? (
						<div>
							<span>loading...</span>
						</div>
					) : status === "ERROR" ? (
						<div style={{ padding: "1rem" }}>
							<GeneralErrorFallback error={error} />
						</div>
					) : (
						<ProjectNavList projects={data} />
					)}
				</section>
			</aside>
			<div className={styles.projectsOutlet}>
				<Outlet context={{ fetchProjects } satisfies ProjectsContext} />
			</div>
		</div>
	);
}
