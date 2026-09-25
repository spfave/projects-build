import { DatePipe } from "@angular/common";
import { Component, inject, input, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { EMPTY, map, switchMap } from "rxjs";

import type { Project } from "@projectsbuild/core/project";
import { HttpResponseError } from "@projectsbuild/library/errors";
import { asyncInitialState, createAsyncStateForFactory } from "~/app/shared/async-state";
import { GeneralErrorFallback } from "~/app/shared/components/error-fallback";
import { ATab } from "~/app/shared/directives/anchor-new-tab";
import { ProjectApiClient } from "../project-api-client";
import { ProjectStore } from "../project-store";

@Component({
	selector: "pb-project-error-fallback",
	imports: [GeneralErrorFallback],
	template: `
		<pb-general-error-fallback
			[error]="error()"
			[httpResponseErrorHandlers]="{
				'404': () => notFound,
				'422': () => invalidProject,
			}"
			[defaultHttpResponseErrorHandler]="() => defaultHttpError"
			[unexpectedErrorHandler]="unexpectedError"
		/>

		<!-- custom error TemplateRefs -->
		<ng-template #notFound let-params="params">
			<div class="error">
				<p>Project with id "{{ params["projectId"] }}" could not be found.</p>
			</div>
		</ng-template>

		<ng-template #invalidProject let-error="error" let-params="params">
			<div class="error">
				<p>Invalid project id: "{{ params["projectId"] }}"</p>
				<p>{{ error.context.message }}</p>
			</div>
		</ng-template>

		<ng-template #defaultHttpError let-error>
			<div class="error">
				<p>Request failed.</p>
				<p>{{ error.context.message }}</p>
			</div>
		</ng-template>

		<ng-template #unexpectedError>
			<p>Oh no! An unexpected error occurred.</p>
		</ng-template>
	`,
	styles: `
		.error {
			padding: 1rem;
			font-weight: bold;
			color: white;
			text-align: center;
			background: var(--color-danger);
			border-radius: 0.5rem;
		}
	`,
})
export class ProjectErrorFallback {
	public readonly error = input.required();
}

@Component({
	selector: "pb-project-info",
	imports: [DatePipe, RouterLink, ATab, ProjectErrorFallback],
	template: `
		@let vProject = project();
		<h2>{{ vProject.name }}</h2>
		<dl>
			<div>
				<dt>Status</dt>
				<dd>{{ vProject.status }}</dd>
			</div>
			<div>
				<dt>Link</dt>
				<dd>
					@if (vProject.link) {
						<a [routerLink]="vProject.link" pbATab>{{ vProject.link }}</a>
					} @else {
						--
					}
				</dd>
			</div>
			<div>
				<dt>Description</dt>
				<dd [style]="{ whiteSpace: 'pre-wrap' }">{{ vProject.description || "--" }}</dd>
			</div>
			<div>
				<dt>Notes</dt>
				<dd [style]="{ whiteSpace: 'pre-wrap' }">{{ vProject.notes || "--" }}</dd>
			</div>
			@if (vProject.status === "complete") {
				<div>
					<dt>Date Completed</dt>
					<dd>
						<time [dateTime]="vProject.dateCompleted">
							{{ vProject.dateCompleted | date: "EE, MMM d, yyyy" }}
						</time>
					</dd>
				</div>
				<div>
					<dt>Build Rating</dt>
					<dd>{{ vProject.rating }}</dd>
				</div>
				<div>
					<dt>Recommend Build</dt>
					<dd>{{ vProject.recommend ? "Yes" : "No" }}</dd>
				</div>
			}
		</dl>
		<div class="projectActions">
			<a class="action primary" routerLink="edit" aria-disabled="{isPending}">Edit</a>
			<!-- <form>
				<button class="action danger" type="submit" name="intent" value="delete">
					Delete
				</button>
			</form> -->
			<button
				class="action danger"
				type="button"
				(click)="deleteProject()"
				[disabled]="delProjState().status === 'loading'"
			>
				Delete
			</button>
		</div>
		@if (delProjState().status === "error") {
			<pb-project-error-fallback
				[style.display]="'block'"
				[error]="delProjState().error"
			/>
		}
	`,
	styles: `
		:host {
			> * + * {
				margin-block-start: 2rem;
			}
		}

		dl {
			> * + * {
				margin-block-start: 1rem;
			}

			& div:first-of-type {
				dd {
					text-transform: capitalize;
				}
			}

			dt {
				font-style: italic;
				font-weight: lighter;

				&::after {
					content: ":";
				}
			}
		}

		.projectActions {
			display: flex;
			gap: 2rem;
			align-items: center;
		}
	`,
})
export class ProjectInfo {
	public readonly project = input.required<Project>();

	readonly #router = inject(Router);
	readonly #projectClient = inject(ProjectApiClient);
	readonly #projectStore = inject(ProjectStore);

	public readonly delProjState = signal(asyncInitialState);
	protected deleteProject() {
		// Observable approach
		this.#projectClient.deleteProject(this.project().id).subscribe((state) => {
			this.delProjState.set(state);
			if (state.status === "resolved") {
				// this.#projectStore.projectsHr.reload(); // sig reload
				this.#projectStore.reloadProjects(); // obs reload
				this.#router.navigate(["/projects"]);
			}
		});
	}

	// protected readonly delProjOpr = this.#projectClient.deleteProjectOperation();
	// protected deleteProject() {
	// 	// Signal approach
	// 	this.delProjOpr.execute(this.project().id).subscribe({
	// 		next: (v) => {
	// 			console.info(`v: `, v); // DEBUG LOG
	// 			this.#projectStore.reloadProjects();
	// 			this.#router.navigate(["projects"]);
	// 		},
	// 		error: (e) => {
	// 			console.info(`e: `, e); // DEBUG LOG
	// 			console.info(`e: `, this.delProjOpr.state().error); // DEBUG LOG
	// 		},
	// 	});
	// }
}

@Component({
	selector: "pb-project-page",
	imports: [ProjectInfo, ProjectErrorFallback],
	template: `
		<section>
			<!-- Project Signal -->
			@if (project.isLoading()) {
				<div>Loading Project...</div>
			} @else if (project.error()) {
				<pb-project-error-fallback [error]="project.cError()" />
			} @else if (project.hasValue()) {
				<!-- Note: httpResourceMapError utility does not narrow type with .hasValue() check -->
				<pb-project-info [project]="project.value()!" />
			}

			<!-- Project Observable -->
			<!-- @let sProject = project$ | async;
			@switch (sProject?.status) {
				@case ("loading") {
					<div>Loading Project...</div>
				}
				@case ("error") {}
				@case ("resolved") {
					<pb-project-info [project]="sProject.value" />
				}
			} -->
		</section>
	`,
	styles: ``,
})
export class ProjectPage {
	protected readonly projectId = input.required<string>(); // URL param

	readonly #projectClient = inject(ProjectApiClient);
	readonly #route = inject(ActivatedRoute);
	protected readonly HttpResponseError = HttpResponseError;

	protected readonly project = this.#projectClient.getProjectByIdHr(this.projectId);
	protected readonly project$ = this.#route.paramMap.pipe(
		map((params) => params.get("projectId")),
		switchMap((id) => (id ? this.#projectClient.getProjectById(id) : EMPTY))
	);
}
