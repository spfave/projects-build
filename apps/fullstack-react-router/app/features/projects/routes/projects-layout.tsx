import * as React from "react";
import { Await, Link, NavLink, Outlet, data } from "react-router";

import * as dbProjects from "@projectsbuild/db-drizzle/data-services/projects.ts";
import plusIcon from "@projectsbuild/shared/assets/heroicons-plus.svg";
import type { Project } from "@projectsbuild/shared/projects";
import type { Route } from "./+types/projects-layout";

// Server Loader
export async function loader(args: Route.LoaderArgs) {
	// await new Promise((res, rej) => setTimeout(res, 1000));
	// const res = await fetch("http://localhost:5001/projects");
	// const projects = (await res.json()) as Array<Project>;
	const projects = await dbProjects.selectProjectsSelect();

	// Pass data
	// return data({ projects }, 200);

	// Pass data promise (streaming)
	const projectsPromise = new Promise<Array<Project>>((res, rej) =>
		setTimeout(() => res(projects as Array<Project>), 1000)
	);
	return data({ projects: projectsPromise }, 200);
}

// Client Loader
// export async function clientLoader(args: Route.ClientLoaderArgs) {
// 	await new Promise((res, rej) => setTimeout(res, 1000));
// 	const res = await fetch("http://localhost:5001/projects");
// 	const projects = (await res.json()) as Array<Project>;
// 	return { projects };
// }
// clientLoader.hydrate = true;

export default function ProjectsLayout(props: Route.ComponentProps) {
	return (
		<div className="flex gap-8">
			<aside className="grid w-[18rem] flex-auto shrink-0 grow-0 gap-4">
				<div>
					<Link
						className="flex items-center justify-between rounded-sm bg-green-600 px-4 py-2 hover:bg-green-300"
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
					<React.Suspense fallback={<div>Suspense Loading Projects...</div>}>
						<Await resolve={props.loaderData.projects}>
							{(projects) => (
								<nav className="grid gap-2">
									{projects.map((project) => (
										<NavLink key={project.id} to={`projects/${project.id}`}>
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

export function HydrateFallback() {
	return <div>Projects layout Loading...</div>;
}
