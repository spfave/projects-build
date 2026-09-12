import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, resource, Service, type Signal } from "@angular/core";
import { catchError, delay } from "rxjs";

import type { Project } from "@projectsbuild/core/project";
import {
	FetchError,
	FetchResponseError,
	HttpResponseError,
} from "@projectsbuild/library/errors";
import { getErrorMessage, wait } from "@projectsbuild/library/utils";
import { environment as ENV } from "~/environments/environment";
import { httpResourceMapError, trackAsyncStateMapError } from "~/shared/async-state";

const urlProjectApi = `${ENV.PUBLIC_URL_API}/api/v1/projects`;

@Service()
export class ProjectApiClient {
	readonly #urlApi = urlProjectApi;
	readonly #http = inject(HttpClient);

	// GET projects
	public getProjects() {
		return this.#http.get<Project[]>(this.#urlApi).pipe(
			delay(500), // include for demo delay
			trackAsyncStateMapError((e) => this.#mapError(e, this.getProjects.name))
		);
	}

	public getProjectsRx() {
		return resource({
			loader: async ({ abortSignal }) => {
				await wait(500);
				return getProjects({ signal: abortSignal });
			},
		});
	}

	public getProjectsHx() {
		return httpResourceMapError<Project[]>(
			() => ({ url: this.#urlApi }),
			(e) => this.#mapError(e, this.getProjectsHx.name)
		);
	}

	// GET Project By Id
	public getProjectById(projectId: string) {
		return this.#http.get<Project>(`${this.#urlApi}/${projectId}`).pipe(
			catchError((err: HttpErrorResponse) => {
				console.info(`err: `, err); // DEBUG LOG
				throw err;
			})
		);
	}

	// public getProjectById(projectId: string) {} // TEST
	public getProjectByIdRx(projectId: Signal<string>) {
		return resource({
			params: () => ({ projectId: projectId() }),
			loader: ({ params, abortSignal }) =>
				getProjectById(params.projectId, { signal: abortSignal }),
		});
	}

	// public getProjectByIdHx() {}

	// public createProject() {}
	// public updateProject() {}
	// public deleteProject() {}

	#mapError(
		error: Error,
		functionName: string,
		fallbackMessage = "Failed to complete request"
	): Error {
		if (error instanceof HttpErrorResponse) {
			if (error.status === 0)
				return new FetchError(`Fetch failed for ${functionName}`, { cause: error });

			const message = getErrorMessage(error.error, { fallbackMessage });
			if (error.status >= 400) return new HttpResponseError(error, message);
			if (!error.ok)
				return new FetchResponseError(`Fetch response not ok for ${functionName}`, {
					cause: error,
				});
		}

		return error;
	}
}

async function getProjects(init?: RequestInit) {
	const res = await fetch(urlProjectApi, init).catch((err) => {
		throw new FetchError("Fetch failed for getProjects", { cause: err });
	});

	const js = await res.json();
	if (res.status >= 400) {
		const message = getErrorMessage(js);
		throw new HttpResponseError(res, message);
	}
	return js as Project[];
}

async function getProjectById(projectId: string, init?: RequestInit) {
	const res = await fetch(`${urlProjectApi}/${projectId}`, init).catch((err) => {
		throw new Error("Fetch failed for getProjectById", { cause: err });
	});

	const js = await res.json();
	if (res.status >= 400) throw new Error(`Failed to get project. Status = ${res.status}`);
	return js as Project;
}
