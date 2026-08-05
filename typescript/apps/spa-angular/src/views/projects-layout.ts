import { AsyncPipe, JsonPipe } from "@angular/common";
import { HttpClient, httpResource } from "@angular/common/http";
import { Component, inject, type OnInit, resource } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { map, type Observable, of, tap } from "rxjs";

import type { Project } from "@projectsbuild/core/project";

import plusIcon from "@projectsbuild/core/assets/heroicons-plus.svg";

@Component({
	selector: "pb-projects-layout",
	imports: [AsyncPipe, JsonPipe, RouterLink, RouterOutlet],
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
				<!-- Projects nav list -->
				<div>
					<!-- Observable -->
					{{ projOb$ | async | json }}
				</div>
				<div>
					<!-- Subscription -->
					{{ projSub | json }}
				</div>
				<div>
					<!-- Resource signal -->
					{{ projRs.value() | json }}
				</div>
				<div>
					<!-- Http Resource signal -->
					{{ projHRs.value() | json }}
				</div>
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
export class ProjectsLayout implements OnInit {
	protected readonly plusIcon = plusIcon;

	protected projOb$: Observable<ProjectListItem[] | null> = of(null);
	protected projSub?: ProjectListItem[] | null = null;
	protected readonly projRs = resource({
		loader: () =>
			fetch("http://localhost:5001/projects").then(
				(res) => res.json() as Promise<Project[]>
			),
	});
	protected readonly projHRs = httpResource<Project[]>(
		() => "http://localhost:5001/projects"
	);

	private readonly http = inject(HttpClient);

	public ngOnInit() {
		console.info(`ProjectsLayout OnInit`); // LOG
		this.projOb$ = this.http.get<Project[]>("http://localhost:5001/projects").pipe(
			tap((projs) => console.info(`tap: projs: `, projs)),
			map((projs) =>
				projs.map((proj) => ({
					id: proj.id,
					name: proj.name,
				}))
			)
		);
		const _projSub = this.projOb$.subscribe({
			next: (projs) => (this.projSub = projs),
		});
	}
}

export type ProjectListItem = Pick<Project, "id" | "name">;
