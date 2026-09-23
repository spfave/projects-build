import { HttpClient, HttpErrorResponse, httpResource } from "@angular/common/http";
import { inject, resource, Service, type Signal } from "@angular/core";
import { delay } from "rxjs";

import type { Project } from "@projectsbuild/core/project";
import {
	FetchError,
	FetchResponseError,
	HttpResponseError,
} from "@projectsbuild/library/errors";
import { getErrorMessage, wait } from "@projectsbuild/library/utils";
import {
	createAsyncStateForFactory,
	mapHttpResourceError,
	trackAsyncStateWithMappedError,
} from "~/app/shared/async-state";
import { environment as ENV } from "~/environments/environment";

const urlProjectApi = `${ENV.PUBLIC_URL_API}/api/v1/projects`;

@Service()
export class ProjectApiClient {
	readonly #urlApi = urlProjectApi;
	readonly #http = inject(HttpClient);

	// GET Projects
	public getProjects() {
		return this.#http.get<Project[]>(this.#urlApi, { params: { type: "obs" } }).pipe(
			delay(500), // include for demo delay
			trackAsyncStateWithMappedError((e) => this.#mapError(e, this.getProjects.name))
		);
	}

	public getProjectsRs() {
		return resource({
			loader: async ({ abortSignal }) => {
				await wait(500);
				return getProjects({ signal: abortSignal });
			},
		});
	}

	public getProjectsHr() {
		return mapHttpResourceError(
			httpResource<Project[]>(() => ({ url: this.#urlApi, params: { type: "hr" } })),
			(e) => this.#mapError(e, this.getProjectsHr.name)
		);
	}

	// GET Project By Id
	public getProjectById(projectId: string) {
		return this.#http
			.get<Project>(`${this.#urlApi}/${projectId}`, { params: { type: "obs" } })
			.pipe(
				delay(500),
				trackAsyncStateWithMappedError((e) => this.#mapError(e, this.getProjectById.name))
			);
	}

	public getProjectByIdRs(projectId: Signal<string>) {
		return resource({
			params: () => ({ projectId: projectId() }),
			loader: ({ params, abortSignal }) =>
				getProjectById(params.projectId, { signal: abortSignal }),
		});
	}

	public getProjectByIdHr(projectId: Signal<string>) {
		return mapHttpResourceError(
			httpResource<Project>(() => ({
				url: `${this.#urlApi}/${projectId()}`,
				params: { type: "hr" },
			})),
			(e) => this.#mapError(e, this.getProjectByIdHr.name)
		);
	}

	// public createProject() {}
	// public updateProject() {}

	// DELETE Project
	public deleteProjectObs(projectId: string) {
		return this.#http.delete<Project>(`${this.#urlApi}/${projectId}`).pipe(
			delay(500),
			trackAsyncStateWithMappedError((e) => this.#mapError(e, this.deleteProjectObs.name))
		);
	}

	public deleteProjectFactory = createAsyncStateForFactory(
		(projectId: string) =>
			this.#http.delete<Project>(`${this.#urlApi}/${projectId}`).pipe(delay(500)),
		(e) => this.#mapError(e, "deleteProjectFactoryExecute")
	);

	#mapError(
		error: Error,
		functionName: string,
		fallbackMessage = "Failed to complete request"
	) {
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
	const params = new URLSearchParams({ type: "rs" });
	const res = await fetch(`${urlProjectApi}?${params}`, init).catch((err) => {
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
	const params = new URLSearchParams({ type: "rs" });
	const res = await fetch(`${urlProjectApi}/${projectId}?${params}`, init).catch(
		(err) => {
			throw new Error("Fetch failed for getProjectById", { cause: err });
		}
	);

	const js = await res.json();
	if (res.status >= 400) throw new Error(`Failed to get project. Status = ${res.status}`);
	return js as Project;
}
