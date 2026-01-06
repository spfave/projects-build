import type { Project, ProjectInput } from "@projectsbuild/core/projects";
import {
	FetchError,
	FetchResponseError,
	HttpResponseError,
} from "@projectsbuild/library/errors";
import { getErrorMessage, wait } from "@projectsbuild/library/utils";

// const URL_API_JSON_SERVER = import.meta.env.VITE_URL_API_JSON_SERVER;
// const URL_API_HONO = `${import.meta.env.VITE_URL_API_HONO}/api/v1`;
// const URL_API_GO = `${import.meta.env.VITE_URL_API_GO}/api/v1`; // Use full path for direct fetch calls, requires CORS config on the server
// const URL_API_GO = `/api/v1`; // Use relative path for vite dev server proxy

const urlApi = import.meta.env.VITE_URL_API;

export async function getProjects() {
	await wait(500);

	// fetch can error: TypeError (network connection failure)
	const res = await fetch(`${urlApi}/projects`).catch((err) => {
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

	return js as Project[];
}

export async function getProjectById(id: string) {
	await wait(500);

	const res = await fetch(`${urlApi}/projects/${id}`).catch((err) => {
		throw new FetchError("Fetch failed for getProjectById", { cause: err });
	});

	const js = await res.json();
	if (res.status >= 400) {
		const msg = getErrorMessage(js, {
			fallbackMessage: `Failed to get project with id: ${id}`,
		});
		throw new HttpResponseError(res, msg);
	}
	if (!res.ok) throw new FetchResponseError("Fetch response not ok for getProjectById");

	return js as Project;
}

export async function createProject(project: ProjectInput) {
	const res = await fetch(`${urlApi}/projects`, {
		method: "POST",
		body: JSON.stringify(project),
	});

	const newProject = (await res.json()) as Project;
	await wait(500);
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
	await wait(500);
	return updatedProject;
}

export async function deleteProject(id: string) {
	const res = await fetch(`${urlApi}/projects/${id}`, {
		method: "DELETE",
	});

	const deletedProject = (await res.json()) as Project;
	await wait(500);
	return deletedProject;
}
