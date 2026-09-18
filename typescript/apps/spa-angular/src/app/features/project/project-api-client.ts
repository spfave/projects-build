import { HttpClient, HttpErrorResponse, httpResource } from "@angular/common/http";
import { inject, resource, Service, type Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
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
	createAsyncStateFromObservable,
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
		return this.#http.get<Project[]>(this.#urlApi).pipe(
			delay(500), // include for demo delay
			trackAsyncStateWithMappedError((e) => this.#mapError(e, this.getProjects.name))
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
		return mapHttpResourceError(
			httpResource<Project[]>(() => this.#urlApi),
			(e) => this.#mapError(e, this.getProjectsHx.name)
		);
	}

	// GET Project By Id
	public getProjectById(projectId: string) {
		return this.#http.get<Project>(`${this.#urlApi}/${projectId}`).pipe(
			delay(500),
			trackAsyncStateWithMappedError((e) => this.#mapError(e, this.getProjectById.name))
		);
	}

	public getProjectByIdRx(projectId: Signal<string>) {
		return resource({
			params: () => ({ projectId: projectId() }),
			loader: ({ params, abortSignal }) =>
				getProjectById(params.projectId, { signal: abortSignal }),
		});
	}

	public getProjectByIdHx(projectId: Signal<string>) {
		return mapHttpResourceError(
			httpResource<Project>(() => `${this.#urlApi}/${projectId()}`),
			(e) => this.#mapError(e, this.getProjectByIdHx.name)
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

	public deleteProjectSig(projectId: string) {
		return toSignal(this.deleteProjectObs(projectId));
	}

	public readonly deleteProjectOpr = createAsyncStateFromObservable<Project>();
	public deleteProjectOprE(projectId: string) {
		return this.deleteProjectOpr.execute(
			this.#http.delete<Project>(`${this.#urlApi}/${projectId}`),
			(e) => this.#mapError(e, this.deleteProjectOprE.name)
		);
	}

	public deleteProjectFactory = createAsyncStateForFactory(
		(projectId: string) =>
			this.#http.delete<Project>(`${this.#urlApi}/${projectId}`).pipe(delay(500)),
		(e) => this.#mapError(e, "deleteProjectOp2")
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
