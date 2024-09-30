import * as React from "react";
import { Link, Outlet, useOutletContext } from "react-router-dom";

import type { Project } from "@projectsbuild/shared/projects";
import GeneralErrorFallback from "~/components/general-error-fallback";
import ProjectNavList from "~/feature-projects/projects-nav-list";

import plusIcon from "@projectsbuild/shared/assets/heroicons-plus.svg";
import styles from "./projects-route.module.css";

export async function getProjects() {
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

export default function ProjectsRoute() {
	const projects = useAsync<Project[]>();

	const fetchProjects = React.useCallback(() => {
		projects.run(getProjects());
	}, [projects.run]);

	React.useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

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
					{projects.status === "PENDING" ? (
						<div>
							<span>loading...</span>
						</div>
					) : projects.status === "ERROR" ? (
						<div style={{ padding: "1rem" }}>
							<GeneralErrorFallback error={projects.error} />
						</div>
					) : (
						<ProjectNavList projects={projects.data} />
					)}
				</section>
			</aside>
			<div className={styles.projectsOutlet}>
				<Outlet context={{ fetchProjects } satisfies ProjectsContext} />
			</div>
		</div>
	);
}

// ----------------------------------------------------------------------------------- //
export type AsyncState<TData = unknown> =
	| { status: "PENDING"; data: null; error: null }
	| { status: "FULFILLED"; data: TData; error: null }
	| { status: "ERROR"; data: null; error: unknown };
export type AsyncStatus = AsyncState["status"];
export type AsyncAction<TData> =
	| { type: "PENDING" }
	| { type: "FULFILLED"; data: TData }
	| { type: "ERROR"; error: unknown }
	| { type: "RESET"; initialState?: AsyncState<TData> };
const asyncInitialState: AsyncState = { status: "FULFILLED", data: null, error: null };

export function asyncReducer<TData>(
	state: AsyncState<TData>,
	action: AsyncAction<TData>
): AsyncState<TData> {
	switch (action.type) {
		case "PENDING":
			return { status: "PENDING", data: null, error: null };
		case "FULFILLED":
			return { status: "FULFILLED", data: action.data, error: null };
		case "ERROR":
			return { status: "ERROR", data: null, error: action.error };
		case "RESET":
			return action?.initialState ?? (asyncInitialState as AsyncState<TData>);
		default:
			return state;
	}
}

export function useAsync<TData>(initialState?: AsyncState<TData>) {
	const initialStateRef = React.useRef<AsyncState<TData>>({
		...(asyncInitialState as AsyncState<TData>),
		...initialState,
	});

	const [state, unsafeDispatch] = React.useReducer(
		asyncReducer<TData>,
		initialStateRef.current
	);
	const safeDispatch = useSafeDispatch(unsafeDispatch);

	const run = React.useCallback(
		async (promise: Promise<TData>) => {
			if (!promise || !promise.then)
				throw new Error("The argument passed to useAsync().run must be a promise.");

			safeDispatch({ type: "PENDING" });
			try {
				const data = await promise;
				safeDispatch({ type: "FULFILLED", data });
				return data;
			} catch (error) {
				safeDispatch({ type: "ERROR", error });
				return await Promise.reject(error);
			}
		},
		[safeDispatch]
	);

	return {
		status: state.status,
		data: state.data,
		error: state.error,
		run,
		isPending: state.status === "PENDING",
		isFulfilled: state.status === "FULFILLED",
		isError: state.status === "ERROR",
	};
}

export function useSafeDispatch<TAction>(dispatch: React.Dispatch<TAction>) {
	const mountedRef = React.useRef(false);

	React.useLayoutEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	return React.useCallback(
		(action: TAction) => (mountedRef.current ? dispatch(action) : void 0),
		[dispatch]
	);
}
