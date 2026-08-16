import { AsyncPipe, JsonPipe } from "@angular/common";
import { HttpClient, type HttpErrorResponse, httpResource } from "@angular/common/http";
import { Component, inject, input, type OnInit, resource } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { catchError, delay, map, of, switchMap, tap } from "rxjs";

import type { Project } from "@projectsbuild/core/project";
import { environment as ENV } from "~/environments/environment";
import { asyncInitialState, asyncState, trackAsync } from "~/shared/async-state";

@Component({
	selector: "pb-project-page",
	imports: [AsyncPipe, JsonPipe],
	template: `
		<section>
			<!-- Signal Resources -->
			<div>
				<h2>Project Resource signal</h2>
				@if (projRs.hasValue()) {
					<p>val: {{ projRs.value() | json }}</p>
				} @else if (projRs.isLoading()) {
					<p>tmp: Loading Projects...</p>
				} @else if (projRs.error()) {
					<p>Failed to load project</p>
					<!-- Api error result content -->
					<p>err.cause: {{ projRs.error()?.cause | json }}</p>
					<!-- Full error signal -->
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
					<!-- Api error result content -->
					<p>err.error: {{ $any(projHRs.error()).error | json }}</p>
					<!-- Full error signal -->
					<p>err: {{ projHRs.error() | json }}</p>
				}
			</div>

			<!-- Observables / Subscriptions -->
			<div>
				<h2>Project Observable</h2>
				<p>val: {{ projOb$ | async | json }}</p>
			</div>
			<div>
				<h2>Project Observable.Subscription()</h2>
				<p>val: {{ projSub | json }}</p>
			</div>
			<div>
				<h2>Project Observable |> Async</h2>
				@if (projObAsync$ | async; as projObAsync) {
					@switch (projObAsync.status) {
						@case ("resolved") {
							<p>val: {{ projObAsync.value | json }}</p>
						}
						@case ("loading") {
							<p>tmp: Loading Projects...</p>
						}
						@case ("error") {
							<p>Failed to load project</p>
							<p>err.error: {{ $any(projObAsync.error).error | json}}</p>
							<p>err: {{ projObAsync.error | json}}</p>
						}
					}
				}
			</div>
			<div>
				<h2>track(Project Observable)</h2>
				<!-- @if (projObTrackState| async; as trkProjOb) { -->
				@if (projObTrackState; as trkProjOb) {
					@switch (trkProjOb.status) {
						@case ("resolved") {
							<p>val: {{ trkProjOb.value | json }}</p>
						}
						@case ("loading") {
							<p>tmp: Loading Projects...</p>
						}
						@case ("error") {
							<p>Failed to load project</p>
							<p>err.error: {{ $any(trkProjOb.error).error | json}}</p>
							<p>err: {{ trkProjOb.error | json}}</p>
						}
					}
				}
			</div>

			<!-- Transforms -->
			<div>
				<h2>Project toSignal(Observable)</h2>
				<p>val: {{ projObS() | json }}</p>
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

	// Url params
	private readonly projIdSs = this.route.snapshot.paramMap.get("projIdParam");
	private readonly projId$ = this.route.paramMap.pipe(
		map((params) => params.get("projIdParam"))
	);
	private readonly projIdSg = toSignal(this.projId$);

	// Signal Resources
	protected readonly projRs = resource({
		params: () => ({ projId: this.projIdSg() }),
		loader: async ({ params }) => {
			const res = await fetch(`${this.urlApi}/${params.projId}?d=rs`);
			const js = await res.json();
			// Note: need to throw manual to get .error() result, otherwise api error result content is surfaced through .value()
			if (res.status >= 400)
				throw new Error(`Failed to get projects. Status = ${res.status}`, { cause: js });

			return js as Project;
		},
	});
	// protected readonly _projHRs = httpResource<Project>(
	// 	() => `${this.urlApi}/${this.projIdParam()}?d=hrs`
	// );
	protected readonly projHRs = httpResource<Project>(() => ({
		url: `${this.urlApi}/${this.projIdParam()}`, // note: api error (status 4xx/5xx) provided through .error() result
		params: { d: "hrs" },
	}));

	// Observables / Subscriptions
	protected _projOb$ = this.http
		.get<Project>(`${this.urlApi}/${this.projIdSs}?d=_ob$`)
		.pipe(
			delay(1000),
			tap((proj) => console.info(`tap: projOb$: `, proj))
		);
	protected projOb$ = this.projId$.pipe(
		delay(1000),
		switchMap((projId) =>
			this.http.get<Project>(`${this.urlApi}/${projId}?d=ob$`, { observe: "response" })
		),
		tap((res) => console.info(`tap: Res projOb$: `, res)),
		map((res) => res.body),
		tap((proj) => console.info(`tap: projOb$: `, proj)),
		catchError((err: HttpErrorResponse, caught) => {
			console.warn(`observable: catchError`); // LOG
			console.info(`err: `, err); // DEBUG LOG
			console.info(`caught: `, caught); // DEBUG LOG
			throw err;
			// return throwError(() => err);
		})
	);
	protected projSub?: Project | null = null;

	private readonly projObTrackAsync = trackAsync(this._projOb$);
	// protected projObTrackState = of(asyncInitialState);
	protected projObTrackState = asyncInitialState;
	readonly projObAsync$ = this._projOb$.pipe(asyncState());

	// Transforms
	protected projObS = toSignal(this.projOb$);

	constructor() {
		console.warn(`Project Loading Page - Constructor`); // LOG

		console.info(`projIdParam: `, this.projIdParam); // DEBUG LOG
		console.info(`projIdSs: `, this.projIdSs); // DEBUG LOG
		console.info(`projId$: `, this.projId$); // DEBUG LOG
		console.info(`projIdSg: `, this.projIdSg()); // DEBUG LOG
		// throw new Error("Kaboom💥 - Project Loading Page");
	}

	public ngOnInit() {
		console.warn(`Project Loading Page - OnInit`); // LOG
		const _projSub = this.projOb$.subscribe({
			next: (proj) => (this.projSub = proj),
			error: (err: HttpErrorResponse) => {
				console.warn(`subscribe: error`); // LOG
				console.info(`err: `, err); // DEBUG LOG
			},
			complete: () => console.info("Proj subscription complete"),
		});

		this.projObTrackAsync.value$.subscribe();
		// this.projObTrackState = this.projObTrackAsync.state$;
		this.projObTrackAsync.state$.subscribe((state) => (this.projObTrackState = state));
	}

	private _typeExploring() {
		const _idP = this.projIdParam();

		const _pRs = this.projRs;
		const _pHrs = this.projHRs;
		const _pSub = this.projSub;
		const _pOb$ = this.projOb$;
		const _pSig = this.projObS;

		const _pTr$ = this.projObTrackAsync;
		const _pAy$ = this.projObAsync$;
	}
}

/* DEMO
 * Errors
 * 1. Network error: fetch failure
 * 2. Http error: 400 bad request, 404 not found, 500 server error
 */
