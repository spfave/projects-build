import * as React from "react";
import { Await, Link, NavLink, Outlet, data, href } from "react-router";

import type { Project } from "@projectsbuild/core/projects";
import * as dbProjects from "@projectsbuild/db-drizzle/repositories/projects.ts"; // SSR only
import plusIcon from "@projectsbuild/shared/assets/heroicons-plus.svg";
import type { Route } from "./+types/projects-layout";

// Server Loader: SSR
export async function loader(args: Route.LoaderArgs) {
	// await new Promise((res, rej) => setTimeout(res, 1000));
	// const res = await fetch("http://localhost:5001/projects");
	// const projects = (await res.json()) as Array<Project>;
	const projects = await dbProjects.selectProjectsSelect();
	// throw "throw projects string";
	// throw new Error("throw projects Error");
	// throw new Response(JSON.stringify({ message: "throw projects response" }), {
	// 	status: 414,
	// });
	// throw data({ message: "throw projects data" }, { status: 424 });

	// Pass data
	// return data({ projects }, 200);

	// Pass data promise (streaming)
	const projectsPromise = new Promise<Array<Project>>((res, rej) =>
		setTimeout(() => {
			// rej("reject projects string");
			// rej(new Error("reject projects Error"));
			// rej(
			// 	new Response(JSON.stringify({ message: "reject projects response" }), {
			// 		status: 434,
			// 	})
			// );
			// rej(data({ message: "reject projects data" }, { status: 444 }));
			res(projects as Array<Project>);
		}, 1000)
	);
	return data({ projects: projectsPromise }, { status: 200 });
}

// Client Loader: SPA mode
// export async function clientLoader(args: Route.ClientLoaderArgs) {
// 	await new Promise((res, rej) => setTimeout(res, 1000));
// 	const res = await fetch(`${import.meta.env.VITE_URL_API_JSON_SERVER}/projects`);
// 	// const res = await fetch(`${import.meta.env.VITE_URL_API_HONO}/api/v1/projects`);
// 	const projects = (await res.json()) as Array<Project>;
// 	return { projects };
// }
// clientLoader.hydrate = true as const;

export default function ProjectsLayout(props: Route.ComponentProps) {
	return (
		<div className="flex gap-8">
			<aside className="grid w-[18rem] flex-auto shrink-0 grow-0 gap-4">
				<div>
					<Link
						className="flex items-center justify-between rounded-sm bg-success px-4 py-2 hover:bg-success-light"
						to="/projects/create"
						relative="path"
					>
						<span>New Project</span>
						<img width={20} src={plusIcon} alt="plus icon" />
					</Link>
				</div>
				<hr className="border-0 border-b-1 border-b-gray-500 border-solid" />
				<section className="grid gap-4">
					<h2 className="px-4 font-bold text-2xl">Projects</h2>

					{/* Server Loader: SSR */}
					{/* <nav className="grid gap-2">
						{props.loaderData.projects.map((project) => (
							<NavLink key={project.id} to={`projects/${project.id}`}>
								<span>{project.name}</span>
							</NavLink>
						))}
					</nav> */}

					{/* Server Loader: SSR Streaming with Suspense */}
					<React.Suspense
						fallback={
							<div className="px-4">
								<p>Suspense Loading Projects...</p>
							</div>
						}
					>
						<Await resolve={props.loaderData.projects}>
							{(projects) => (
								<nav className="grid gap-2">
									{projects.map((project) => (
										<NavLink
											key={project.id}
											to={href("/projects/:id", { id: project.id })}
										>
											<span>{project.name}</span>
										</NavLink>
									))}
								</nav>
							)}
						</Await>
					</React.Suspense>

					{/* Client Loader: Use with hydrate fallback */}
					{/* <nav className="grid gap-2">
						{props.loaderData.projects.map((project) => (
							<NavLink key={project.id} to={`projects/${project.id}`}>
								<span>{project.name}</span>
							</NavLink>
						))}
					</nav> */}
				</section>
			</aside>
			<div className="grow">
				<Outlet />
			</div>
		</div>
	);
}

// Notes:
// - SSR with client loader
//   on initial page load the fallback is shown, component renders after client loader data is ready
//   on navigation the fallback is not show, page navigation(url change)/component render is delayed
//   until client loader data is ready
// - In SPA mode HydrateFallback only allowed on the root route (root.tsx)
export function HydrateFallback() {
	return <div>Projects layout Loading...</div>;
}

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
	console.warn(`\nERROR BOUNDARY: PROJECTS LAYOUT`); //LOG
	console.info(`props.error: `, props.error); //LOG
	return <div>A error occurred on projects layout</div>;
}
