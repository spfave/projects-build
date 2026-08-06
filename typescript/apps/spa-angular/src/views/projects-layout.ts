import { AsyncPipe, JsonPipe } from "@angular/common";
import { HttpClient, httpResource } from "@angular/common/http";
import { Component, inject, type OnInit, resource } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterLink, RouterOutlet } from "@angular/router";
import { catchError, type Observable, of, tap } from "rxjs";

import type { Project } from "@projectsbuild/core/project";
import { environment as ENV } from "~/environments/environment";

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
					<p>obs: {{ projOb$ | async | json }}</p>
				</div>
				<div>
					<!-- Subscription -->
					<p>sub: {{ projSub | json }}</p>
				</div>
				<div>
					<!-- Resource signal -->
					@if (projRs.hasValue()) {
						<p>rs v: {{ projRs.value() | json }}</p>
					} @else if (projRs.isLoading()) {
						<p>rs l: Loading Projects...</p>
					} @else if (projRs.error()) {
						<p>rs e: Failed to load projects</p>
						<p>rs e: {{ projRs.error() }}</p>
					}
				</div>
				<div>
					<!-- Http Resource signal -->
					@if (projHRs.hasValue()) {
						<p>hrs v: {{ projHRs.value() | json }}</p>
					} @else if (projHRs.isLoading()) {
						<p>hrs l: Loading Projects...</p>
					} @else if (projHRs.error()) {
						<p>hrs e: Failed to load projects</p>
						<p>hrs e: {{ projHRs.error()?.message }}</p>
					}
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
	private readonly urlApi = `${ENV.PUBLIC_URL_API}/api/v1/projects`;

	private readonly http = inject(HttpClient);

	protected projOb$: Observable<ProjectListItem[] | null> = of(null);
	protected projSub?: ProjectListItem[] | null = null;
	protected projObS = toSignal(this.projOb$);

	protected readonly projRs = resource({
		loader: () => fetch(this.urlApi).then((res) => res.json() as Promise<Project[]>),
	});
	protected readonly projHRs = httpResource<Project[]>(() => this.urlApi);

	public ngOnInit() {
		console.info(`ProjectsLayout OnInit`); // LOG
		this.projOb$ = this.http.get<Project[]>(this.urlApi).pipe(
			tap((projs) => console.info(`tap: projs: `, projs)),
			catchError((err, caught) => {
				console.info(`rxjs: catchError`); // LOG
				console.info(`err: `, err); // DEBUG LOG
				console.info(`caught: `, caught); // DEBUG LOG
				return of();
			})
		);
		const _projSub = this.projOb$.subscribe({
			next: (projs) => (this.projSub = projs),
			error: (err) => {
				console.info(`subscribe: error`); // LOG
				console.info(`err: `, err); // DEBUG LOG
			},
		});
	}
}

export type ProjectListItem = Pick<Project, "id" | "name">;
