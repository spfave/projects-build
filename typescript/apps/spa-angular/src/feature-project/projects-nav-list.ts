import { Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

import type { ProjectListItem } from "~/views/projects-layout";

@Component({
	imports: [RouterLink, RouterLinkActive],
	selector: "pb-projects-nav-list",
	template: `
		@if (!projects() || projects()?.length === 0) {
			<div class="projects-nav-list-empty">No Projects Exist</div>
		} @else {
			<nav class="projects-nav-list">
				@for (project of projects(); track project.id) {
					<a routerLinkActive="active-link" [routerLink]="project.id">
						<span>{{ project.name }}</span>
					</a>
				}
			</nav>
		}
	`,
	styles: `
		:host {
			display: block;
		}

		.projects-nav-list {
			display: grid;
			gap: 0.5rem;
		}

		a {
			padding: 0.5rem 1rem;
			border-radius: 0.3rem;

			&:hover {
				background-color: var(--color-primary-xlight);
			}

			span {
				--max-lines: 2;

				display: -webkit-box;
				-webkit-box-orient: vertical;
				padding: initial;
				overflow: clip;
				-webkit-line-clamp: var(--max-lines);
				line-clamp: var(--max-lines);
			}
		}

		.projects-nav-list-empty {
			padding: 0.5rem 1rem;
		}

		.active-link {
			background-color: var(--color-primary-light);
		}
	`,
})
export class ProjectsNavList {
	projects = input<ProjectListItem[]>();
}
