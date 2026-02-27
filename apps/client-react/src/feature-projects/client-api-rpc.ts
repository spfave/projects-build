import { hc } from "hono/client";

import type { ApiProject } from "@projectsbuild/api-hono/routes/projects-rpc.ts";
import type { Project, ProjectInput } from "@projectsbuild/core/projects";
import {
	FetchError,
	FetchResponseError,
	HttpResponseError,
} from "@projectsbuild/library/errors";
import { getErrorMessage, wait } from "@projectsbuild/library/utils";

// Note: pre-typed client does not work as process.env is not defined when run through vite import
// const client = hcApiProjectsTyped(import.meta.env.VITE_URL_API_HONO);
const client = hc<ApiProject>(import.meta.env.VITE_URL_API_HONO);

export async function getProjects() {
	await wait(500);

	// RPC call (fetch) can error: TypeError (network connection failure)
	const res = await client.api.v1.projects.$get().catch((err) => {
		throw new FetchError("Fetch failed for getProjects", { cause: err });
	});

	// json parsing can error: SyntaxError
	const js = await res.json();

	// response 'status' or 'ok' property can indicate an error
	if (res.status >= 400) {
		const msg = getErrorMessage(js, {
			fallbackMessage: "Failed to get projects",
		});
		throw new HttpResponseError(res, msg);
	}
	if (!res.ok)
		throw new FetchResponseError("Fetch response not ok for getProjects", { cause: res });

	return js;
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

export async function deleteProject(id: string) {
	const res = await client.api.v1.projects[":id"].$delete({ param: { id } });
	const deletedProject = res.json();
	return deletedProject;
}
