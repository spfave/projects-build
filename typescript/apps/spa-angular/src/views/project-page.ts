import { AsyncPipe, DatePipe } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { EMPTY, map, switchMap } from "rxjs";

import type { Project } from "@projectsbuild/core/project";
import { HttpResponseError } from "@projectsbuild/library/errors";
import {
	DefaultErrorFallback,
	DefaultHttpResponseErrorFallback,
} from "~/components/error-fallback";
import { ATab } from "~/directives/anchor-new-tab";
import { ProjectApiClient } from "~/feature-project/project-api-client";

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
			<form action="{deleteProjectAction}">
				<button class="action danger" type="submit" name="intent" value="delete">
					Delete
				</button>
			</form>
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
}

@Component({
	selector: "pb-project-page",
	imports: [
		AsyncPipe,
		ProjectInfo,
		DefaultErrorFallback,
		DefaultHttpResponseErrorFallback,
	],
	template: `
		<section>
			@if (project.isLoading()) {
				<div>Loading Project...</div>
			} @else if (project.error()) {
				@let error = project.cError();
				@if (error instanceof HttpResponseError) {
					<pb-default-http-error-fallback [error]="error" />
				} @else {
					<pb-default-error-fallback [error]="error" />
				}
			} @else if (project.hasValue()) {
				<!-- Note: httpResourceMapError utility does not narrow type with .hasValue() check -->
				<pb-project-info [project]="project.value()!" />
			}

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
