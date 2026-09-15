import { AsyncPipe, DatePipe } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { EMPTY, map, switchMap } from "rxjs";

import { ATab } from "~/directives/anchor-new-tab";
import { ProjectApiClient } from "~/feature-project/project-api-client";

@Component({
	selector: "pb-project-page",
	imports: [AsyncPipe, DatePipe, RouterLink, ATab],
	template: `
		<section>
			@if (project.isLoading()) {
				<div>Loading Project...</div>
			} @else if (project.error()) {
			} @else if (project.hasValue()) {
				<!-- Note: httpResourceMapError utility does not narrow type with .hasValue() check -->
				@let vProject = project.value()!;
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
								<time dateTime="{project.dateCompleted}">
									{{ vProject.dateCompleted | date : 'EE, MMM d, yyyy' }}
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
					<a routerLink="edit" class="action primary" aria-disabled="{isPending}">
						Edit
					</a>
					<form action="{deleteProjectAction}">
						<button
							class="action danger"
							type="submit"
							name="intent"
							value="delete"
						>
							Delete
						</button>
					</form>
				</div>
			}

			<!-- @let sProject = project$ | async;
			@switch (sProject?.status) {
				@case ("loading") {}
				@case ("error") {}
				@case ("resolved") {
					@let vProject = sProject.value;
					<h2>{{ vProject.name }}</h2>
				}
			} -->
		</section>
	`,
	styles: `
		:host {
			display: block;
		}

		section {
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
export class ProjectPage {
	protected readonly projectId = input.required<string>(); // URL param

	readonly #projectClient = inject(ProjectApiClient);
	readonly #route = inject(ActivatedRoute);

	protected readonly project = this.#projectClient.getProjectByIdHx(this.projectId);
	protected readonly project$ = this.#route.paramMap.pipe(
		map((params) => params.get("projectId")),
		switchMap((id) => (id ? this.#projectClient.getProjectById(id) : EMPTY))
	);
}
