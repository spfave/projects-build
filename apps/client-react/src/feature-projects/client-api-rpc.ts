import { hc } from "hono/client";

import type { ApiProject } from "@projectsbuild/api-hono/routes/projects-rpc.ts";
import {
	FetchError,
	FetchResponseError,
	HttpResponseError,
} from "@projectsbuild/library/errors";
import type { Project, ProjectInput } from "@projectsbuild/shared/projects";

// Note: pre-typed client does not work as process.env is not defined when run through vite import
// const client = hcApiProjectsTyped(import.meta.env.VITE_URL_API_HONO);
const client = hc<ApiProject>(import.meta.env.VITE_URL_API_HONO);

export async function getProjects() {
	// RPC call (fetch) can error: network connection failure
	const res = await client.api.v1.projects.$get().catch((err) => {
		throw new FetchError("Fetch failed for getProjects", { cause: err });
	});

	// response 'status' or 'ok' property can indicate an error
	if (res.status >= 400)
		throw new HttpResponseError(res, "Http status error for getProjects");
	if (!res.ok)
		throw new FetchResponseError("Fetch response not ok for getProjects", { cause: res });

	// json parsing can error: SyntaxError
	const projects = res.json();
	return projects;
}

export async function getProjectById(id: string) {
	const res = await client.api.v1.projects[":id"].$get({ param: { id } });
	const project = res.json();
	return project;
}

export async function createProject(project: ProjectInput) {
	const res = await client.api.v1.projects.$post({ json: project });
	const newProject = res.json();
	return newProject;
}

export async function updateProject(project: Project) {
	const res = await client.api.v1.projects[":id"].$put({
		param: { id: project.id },
		json: project,
	});
	const updatedProject = res.json();
	return updatedProject;
}

export async function deleteProjectById(id: string) {
	const res = await client.api.v1.projects[":id"].$delete({ param: { id } });
	const deletedProject = res.json();
	return deletedProject;
}
