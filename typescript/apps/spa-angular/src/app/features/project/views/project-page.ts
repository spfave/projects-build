import { DatePipe } from "@angular/common";
import { Component, effect, inject, input } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { EMPTY, map, switchMap } from "rxjs";

import type { Project } from "@projectsbuild/core/project";
import { HttpResponseError } from "@projectsbuild/library/errors";
import { ProjectApiClient } from "~/app/features/project/project-api-client";
import { GeneralErrorFallback } from "~/app/shared/components/error-fallback";
import { ATab } from "~/app/shared/directives/anchor-new-tab";

@Component({
	selector: "pb-project-info",
	imports: [DatePipe, RouterLink, ATab],
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
			<button class="action danger" type="button" (click)="deleteProject()">
				Delete
			</button>
		</div>
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

	readonly #projectClient = inject(ProjectApiClient);

	public delFct = this.#projectClient.deleteProjectFactory;
	protected deleteProject() {
		console.warn(`Handler: delete project`); // LOG_WARN

		// const _dObs = this.#projectClient.deleteProjectObs(this.project().id).subscribe();

		const _dFct = this.delFct.execute(this.project().id).subscribe();
		const _dFctSt = this.delFct.state;
	}
}

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

		<ng-template #defaultHttpError>
			<p>Project request failed.</p>
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
	constructor() {
		effect(() => {
			console.info(`PEF error(): `, this.error()); // LOG DEBUG
		});
	}
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

	protected readonly project = this.#projectClient.getProjectByIdHx(this.projectId);
	protected readonly project$ = this.#route.paramMap.pipe(
		map((params) => params.get("projectId")),
		switchMap((id) => (id ? this.#projectClient.getProjectById(id) : EMPTY))
	);
}
