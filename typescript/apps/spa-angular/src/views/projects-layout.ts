import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

import type { Project } from "@projectsbuild/core/project";
import { ProjectApiClient } from "~/feature-project/project-api-client";
import { ProjectsNavList } from "~/feature-project/projects-nav-list";

import plusIcon from "@projectsbuild/core/assets/heroicons-plus.svg";

export type ProjectListItem = Pick<Project, "id" | "name">;

@Component({
	selector: "pb-projects-layout",
	imports: [AsyncPipe, RouterLink, RouterOutlet, ProjectsNavList],
	template: `
		<aside>
			<div>
				<a class="action success" routerLink="create">
					<span>New Project</span>
					<img height="20" [src]="plusIcon" alt="plus icon" />
				</a>
			</div>
			<hr />
			<section>
				<h2>Projects</h2>
				<!-- Projects Signal -->
				<!-- @switch (psR.status()) {
					@case ("resolved") {
						<pb-projects-nav-list [projects]="psR.value()" />
					}
					@case ("loading") {
						<p>Loading Projects...</p>
					}
					@case ("error") {
						<p>Error</p>
					}
					@default {}
				} -->

				<!-- Projects Observable -->
				@let ps = ps$ | async;
				@switch (ps?.status) {
					@case ("resolved") {
						<pb-projects-nav-list [projects]="ps.value" />
					}
					@case ("loading") {
						<div>
							<span>Loading Projects...</span>
						</div>
					}
					@case ("error") {
						<div>
							<p>Error</p>
						</div>
					}
					@default {}
				}
			</section>
		</aside>
		<div class="project-outlet">
			<router-outlet />
		</div>
	`,
	styles: `
		:host {
			display: flex;
			gap: 2rem;
		}

		aside {
			display: flex;
			flex: 0 0 auto;
			flex-direction: column;
			gap: 1rem;
			width: 18rem;

			> div:has(a) {
				a {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0.5rem 1rem;
				}
			}

			hr {
				border: none;
				border-bottom: 1px solid var(--color-gray);
			}

			section {
				> * + * {
					margin-block-start: 1rem;
				}

				h2 {
					padding: 0 1rem;
				}

				div {
					span {
						padding: 0 1rem;
					}
				}
			}
		}

		.project-outlet {
			flex-grow: 1;
		}
	`,
})
export class ProjectsLayout {
	protected readonly plusIcon = plusIcon;

	readonly #projectClient = inject(ProjectApiClient);

	// protected readonly psR = this.#projectClient.getProjectsRx();
	// protected readonly psH = this.#projectClient.getProjectsHx();
	protected readonly ps$ = this.#projectClient.getProjects();
}
