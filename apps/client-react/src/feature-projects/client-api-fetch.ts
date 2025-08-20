import type { Project, ProjectInput } from "@projectsbuild/core/projects";
import {
	FetchError,
	FetchResponseError,
	HttpResponseError,
} from "@projectsbuild/library/errors";

// const URL_API_JSON_SERVER = import.meta.env.VITE_URL_API_JSON_SERVER;
// const URL_API_HONO = `${import.meta.env.VITE_URL_API_HONO}/api/v1`;
// const URL_API_GO = `${import.meta.env.VITE_URL_API_GO}/api/v1`; // Use full path for direct fetch calls, requires CORS config on the server
// const URL_API_GO = `/api/v1`; // Use relative path for vite dev server proxy

const urlApi = import.meta.env.VITE_URL_API;

export async function getProjects() {
	// fetch can error: network connection failure
	const res = await fetch(`${urlApi}/projects`).catch((err) => {
		throw new FetchError("Fetch failed for getProjects", { cause: err });
	});

	// response 'status' or 'ok' property can indicate an error
	if (res.status >= 400)
		// throw new HttpResponseError(res, "Http status error for getProjects");
		throw new HttpResponseError(res, "Failed to get projects");
	if (!res.ok)
		throw new FetchResponseError("Fetch response not ok for getProjects", { cause: res });

	// json parsing can error: SyntaxError
	const projects = (await res.json()) as Project[];
	return projects;
}

export async function getProjectById(id: string) {
	const res = await fetch(`${urlApi}/projects/${id}`).catch((err) => {
		throw new FetchError("Fetch failed for getProjectById", { cause: err });
	});

	if (res.status >= 400)
		throw new HttpResponseError(res, `Failed to get project with id: ${id}`);
	if (!res.ok) throw new FetchResponseError("Fetch response not ok for getProjectById");

	const project = (await res.json()) as Project;
	return project;
}

export async function createProject(project: ProjectInput) {
	const res = await fetch(`${urlApi}/projects`, {
		method: "POST",
		body: JSON.stringify(project),
	});

	const newProject = (await res.json()) as Project;
	return newProject;
}

export async function updateProject(project: Project) {
	const res = await fetch(`${urlApi}/projects/${project.id}`, {
		method: "PUT",
		body: JSON.stringify(project),
	}).catch((err) => {
		throw new FetchError("Fetch failed for updateProject", { cause: err });
	});

	if (res.status >= 400) throw new HttpResponseError(res, "Failed to update project");
	if (!res.ok) throw new FetchResponseError("Fetch response not ok for updateProject");

	const updatedProject = (await res.json()) as Project;
	return updatedProject;
}

export async function deleteProject(id: string) {
	const res = await fetch(`${urlApi}/projects/${id}`, {
		method: "DELETE",
	});

	const deletedProject = (await res.json()) as Project;
	return deletedProject;
}
