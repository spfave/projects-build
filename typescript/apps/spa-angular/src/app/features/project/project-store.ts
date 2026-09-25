import { inject, Service } from "@angular/core";
import { Subject, startWith, switchMap } from "rxjs";

import { ProjectApiClient } from "./project-api-client";

@Service()
export class ProjectStore {
	readonly #projectClient = inject(ProjectApiClient);

	// Projects list
	// Signal approach: eagerly loads
	// public readonly projectsHr = this.#projectClient.getProjectsHr();
	// public reloadProjectsHr() {
	// 	this.projectsHr.reload();
	// }

	// Observable approach
	readonly #projectsReload$ = new Subject<void>();
	public reloadProjects() {
		this.#projectsReload$.next();
	}

	public loadProjects() {
		return this.#projectsReload$.pipe(
			startWith(undefined),
			switchMap(() => this.#projectClient.getProjects())
		);
	}
}
