import type { Project, ProjectId, ProjectInput } from "@projectsbuild/core/projects";
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
	// Possible HTTP errors:
	// 500 internal server error: exception (unknown error, db error)
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

export async function getProjectById(id: ProjectId) {
	await wait(500);

	const res = await fetch(`${urlApi}/projects/${id}`).catch((err) => {
		throw new FetchError("Fetch failed for getProjectById", { cause: err });
	});

	// Possible HTTP errors:
	// 400 bad request: malformed input (unparsable/missing id)
	// 422 unprocessable entity: validation error (invalid id)
	// 404 not found
	// 500 internal server error: exception (unknown error, db error)
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
	await wait(500);

	const res = await fetch(`${urlApi}/projects`, {
		method: "POST",
		body: JSON.stringify(project),
	}); //.catch();

	// Possible HTTP errors:
	// 400 bad request: malformed input (invalid json)
	// 422 unprocessable entity: validation error (invalid input)
	// 500 internal server error: exception (unknown error, db error)
	const js = await res.json();
	if (res.status >= 400) {
		const msg = getErrorMessage(js, { fallbackMessage: "Failed to create project" });
		throw new HttpResponseError(res, msg, { cause: js });
	}
	// if (!res.ok) throw new FetchResponseError("Fetch response not ok for createProject");

	return js as Project;
}

export async function updateProject(project: Project) {
	await wait(500);

	const res = await fetch(`${urlApi}/projects/${project.id}`, {
		method: "PUT",
		body: JSON.stringify(project),
	}).catch((err) => {
		throw new FetchError("Fetch failed for updateProject", { cause: err });
	});

	// Possible HTTP errors:
	// 400 bad request: malformed input (invalid json)
	// 422 unprocessable entity: validation error (invalid input)
	// 404 not found
	// 500 internal server error: exception (unknown error, db error)
	const js = await res.json();
	if (res.status >= 400) {
		const msg = getErrorMessage(js, { fallbackMessage: "Failed to update project" });
		throw new HttpResponseError(res, msg, { cause: js });
	}
	if (!res.ok) throw new FetchResponseError("Fetch response not ok for updateProject");

	return js as Project;
}

export async function deleteProject(id: ProjectId) {
	await wait(500);

	const res = await fetch(`${urlApi}/projects/${id}`, {
		method: "DELETE",
	}); //.catch();

	// Possible HTTP errors:
	// 400 bad request: malformed input (unparsable/missing id)
	// 422 unprocessable entity: validation error (invalid id)
	// 404 not found: nonexistent id
	// 500 internal server error: exception (db error)
	const js = await res.json();
	if (res.status >= 400) {
		const msg = getErrorMessage(js, {
			fallbackMessage: `Failed to delete project`,
		});
		throw new HttpResponseError(res, msg);
	}
	// if (!res.ok)

	return js as Project;
}
