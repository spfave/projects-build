import { AsyncPipe, JsonPipe } from "@angular/common";
import { HttpClient, type HttpErrorResponse, httpResource } from "@angular/common/http";
import { Component, inject, input, type OnInit, resource } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { catchError, map, of, switchMap, tap } from "rxjs";

import type { Project } from "@projectsbuild/core/project";
import { environment as ENV } from "~/environments/environment";

@Component({
	selector: "pb-project-page",
	imports: [AsyncPipe, JsonPipe],
	template: `
		<section>
			<div>
				<h2>Project Resource signal</h2>
				@if (projRs.hasValue()) {
					<p>val: {{ projRs.value() | json }}</p>
				} @else if (projRs.isLoading()) {
					<p>tmp: Loading Projects...</p>
				} @else if (projRs.error()) {
					<p>Failed to load project</p>
					<p>err: {{ projRs.error() }}</p>
				}
			</div>
			<div>
				<h2>Project HttpResource signal</h2>
				@if (projHRs.hasValue()) {
					<p>val: {{ projHRs.value() | json }}</p>
				} @else if (projHRs.isLoading()) {
					<p>tmp: Loading Projects...</p>
				} @else if (projHRs.error()) {
					<p>Failed to load project</p>
					<p>err: {{ $any(projHRs.error()).error | json }}</p>
				}
			</div>
			<div>
				<h2>Project Observable</h2>
				<p>{{ projOb$ | async | json }}</p>
			</div>
			<div>
				<h2>Project toSignal(Observable)</h2>
				<p>val:{{ projObS() | json }}</p>
			</div>
			<div>
				<h2>Project Observable.Subscription()</h2>
				<p>val: {{ projSub | json }}</p>
			</div>
		</section>
	`,
	styles: `
		section {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 2rem 1rem;
		}
	`,
})
export class ProjectLoadingPage implements OnInit {
	private readonly urlApi = `${ENV.PUBLIC_URL_API}/api/v1/projects`;

	protected readonly projIdParam = input.required<string>(); // from router to component input binding

	private readonly route = inject(ActivatedRoute);
	private readonly http = inject(HttpClient);

	private readonly projIdSs = this.route.snapshot.paramMap.get("projIdParam");
	private readonly projId$ = this.route.paramMap.pipe(
		map((params) => params.get("projIdParam"))
	);
	private readonly projIdSg = toSignal(this.projId$);

	protected readonly projRs = resource({
		params: () => ({ projId: this.projIdSg() }),
		loader: async ({ params }) => {
			const res = await fetch(`${this.urlApi}/${params.projId}?d=rs`);
			const js = await res.json();
			// Note: need to throw manual to get .error result
			if (res.status >= 400)
				throw new Error(`Failed to get projects. Status = ${res.status}`);

			return js as Project;
		},
	});
	// protected readonly projHRs = httpResource<Project>(() => `${this.urlApi}?d=hrs`);
	protected readonly projHRs = httpResource<Project>(() => ({
		url: `${this.urlApi}/${this.projIdParam()}`,
		params: { d: "hrs" },
	}));
	protected projSub?: Project | null = null;
	protected _projOb$ = this.http
		.get<Project>(`${this.urlApi}/${this.projIdSs}?d=ob$`)
		.pipe(tap((proj) => console.info(`tap: projOb$: `, proj)));
	protected projOb$ = this.projId$.pipe(
		switchMap((projId) => this.http.get<Project>(`${this.urlApi}/${projId}?d=ob$`)),
		tap((proj) => console.info(`tap: projOb$: `, proj)),
		catchError((err, caught) => {
			console.info(`observable: catchError`); // LOG
			console.info(`err: `, err); // DEBUG LOG
			console.info(`caught: `, caught); // DEBUG LOG
			return of(err.error);
		})
	);
	protected projObS = toSignal(this.projOb$);

	constructor() {
		console.warn(`Project Loading Page - Constructor`); // LOG

		console.info(`projIdParam: `, this.projIdParam); // DEBUG LOG
		console.info(`projIdSs: `, this.projIdSs); // DEBUG LOG
		console.info(`projId$: `, this.projId$); // DEBUG LOG
		console.info(`projIdSg: `, this.projIdSg()); // DEBUG LOG
	}

	public ngOnInit() {
		console.warn(`Project Loading Page - OnInit`); // LOG
		const _projSub = this.projOb$.subscribe({
			next: (proj) => (this.projSub = proj),
			error: (err: HttpErrorResponse) => {
				console.info(`subscribe: error`); // LOG
				console.info(`err: `, err); // DEBUG LOG
			},
			complete: () => console.info("Proj subscription complete"),
		});
		this.projRs.reload();
	}

	private _typeExploring() {
		const _idP = this.projIdParam();

		const _sub = this.projSub;
		const _ob$ = this.projOb$;
		const _sig = this.projObS;
		const _rs = this.projRs;
		const _hrs = this.projHRs;
	}
}

/* DEMO
 * Errors
 * 1. Network error: fetch failure
 * 2. Http error: 400 bad request, 404 not found, 500 server error
 */
