import { HttpClient, type HttpErrorResponse, httpResource } from "@angular/common/http";
import { inject, resource, Service, type Signal } from "@angular/core";
import { catchError } from "rxjs";

import type { Project } from "@projectsbuild/core/project";
import { environment as ENV } from "~/environments/environment";

const urlProjectApi = `${ENV.PUBLIC_URL_API}/api/v1/projects`;

@Service()
export class ProjectApiClient {
	readonly #urlApi = urlProjectApi;
	readonly #http = inject(HttpClient);

	public getProjects() {
		return this.#http.get<Project[]>(this.#urlApi).pipe(
			catchError((err: HttpErrorResponse, _caught) => {
				throw err;
			})
		);
	}

	public getProjectsRx() {
		return resource({
			loader: ({ abortSignal }) => getProjects({ signal: abortSignal }),
		});
	}

	public getProjectsHx() {
		return httpResource<Project[]>(() => ({ url: this.#urlApi }));
	}

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

	// public createProject() {}
	// public updateProject() {}
	// public deleteProject() {}
}

async function getProjects(init?: RequestInit) {
	const res = await fetch(urlProjectApi, init);
	const js = await res.json();
	if (res.status >= 400)
		throw new Error(`Failed to get projects. Status = ${res.status}`);
	return js as Project[];
}

async function getProjectById(projectId: string, init?: RequestInit) {
	const res = await fetch(`${urlProjectApi}/${projectId}`, init);
	const js = await res.json();
	if (res.status >= 400) throw new Error(`Failed to get project. Status = ${res.status}`);
	return js as Project;
}
