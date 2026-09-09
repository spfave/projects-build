import { AsyncPipe, JsonPipe } from "@angular/common";
import { HttpClient, type HttpErrorResponse, httpResource } from "@angular/common/http";
import { Component, inject, input, type OnInit, resource } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { catchError, delay, map, of, switchMap, tap } from "rxjs";

import type { Project } from "@projectsbuild/core/project";
import { getErrorMessage } from "@projectsbuild/library/utils";
import { environment as ENV } from "~/environments/environment";
import { asyncInitialState, mapAsyncState, trackAsyncState } from "~/shared/async-state";

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
					<!-- Resource error signal: 
						.error(): thrown Error from resource() loader. Serialized to string <e.name>:<e.message> in template
						.error().message/.name/.stack: properties of thrown Error
						.error().cause: property of thrown Error. Set to api error response content
					-->
					<p>err: {{ projRs.error() }}</p>
					<p>err.message: {{ projRs.error()?.message }}</p>
					<p>err.cause: {{ projRs.error()?.cause | json }}</p>
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
					<!-- Http resource error signal 
					 	.error(): Angular HttpClient thrown HttpErrorResponse Error (httpResource wraps HttpClient). Serialized as object
						.error().error: property of HttpErrorResponse. Set to api error response content
					-->
					<p>err.name: {{ projHRs.error()?.name }}</p>
					<p>err.message: {{ projHRs.error()?.message }}</p>
					<p>err.error: {{ $any(projHRs.error()).error | json }}</p>
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
				@let projObAsync = projObAsync$ | async;
				@switch (projObAsync?.status) {
					@case ("resolved") {
						<p>val: {{ projObAsync.value | json }}</p>
					}
					@case ("loading") {
						<p>tmp: Loading Projects...</p>
					}
					@case ("error") {
						<p>Failed to load project</p>
						@if ("headers" in $any(projObAsync.error)) {
							<!-- HttpClient error
								.error(): Angular HttpClient thrown HttpErrorResponse Error
								.error().error: property of HttpErrorResponse. Set to api error response content
							-->
							<p>err.error: {{ $any(projObAsync.error).error | json }}</p>
							<p>err: {{ projObAsync.error | json }}</p>
						} @else {
							<!-- transformed error 
								.error: thrown transformed Error from .catchError() operator. Serialized to string <e.name>:<e.message> in template
								.error.cause: property of thrown transformed Error. Set to HttpErrorResponse
								.error.cause.error: property of thrown transformed Error. Set to api error response content
							-->
							<p>err: {{ projObAsync.error }}</p>
							<p>err.cause: {{ $any(projObAsync.error).cause.error | json }}</p>
						}
					}
				}
			</div>
			<div>
				<h2>track(Project Observable)</h2>
				<!-- @let trkProjOb = projObTrackState | async; -->
				@let trkProjOb = projObTrackState;
				@switch (trkProjOb.status) {
					@case ("resolved") {
						<p>val: {{ trkProjOb.value | json }}</p>
					}
					@case ("loading") {
						<p>tmp: Loading Projects...</p>
					}
					@case ("error") {
						<p>Failed to load project</p>
						@if ("headers" in $any(trkProjOb.error)) {
							<p>err.error: {{ $any(trkProjOb.error).error | json }}</p>
							<p>err: {{ trkProjOb.error | json }}</p>
						} @else {
							<p>err: {{ trkProjOb.error }}</p>
							<p>err.cause: {{ $any(trkProjOb.error).cause.error | json }}</p>
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
		:host {
			display: block;
			container: project-load / inline-size;
		}

		section {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 2rem 1rem;
		}
		@container project-load (width < 800px) {
			section {
				grid-template-columns: 1fr;
			}
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
			const res = await fetch(`${this.urlApi}/${params.projId}?d=rs`).catch((error) => {
				throw new Error("Fetch failed for getProjectById", { cause: error });
			});

			const js = await res.json();
			// Note: need to throw manual to get .error() result, otherwise api error result content is surfaced through .value()
			if (res.status >= 400)
				// throw new Error(`Failed to get project. Status = ${res.status}`, { cause: js });
				throw new Error(getErrorMessage(js), { cause: js });

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
			tap((proj) => console.info(`tap: _projOb$: `, proj)),
			catchError((err) => {
				// throw err;
				throw transformHttpClientError(err);
			})
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
			// throw transformHttpClientError(err);
			// return throwError(() => err);
		})
	);
	protected projSub?: Project | null = null;

	private readonly projObTrackAsync = trackAsyncState(this._projOb$);
	// protected projObTrackState = of(asyncInitialState);
	protected projObTrackState = asyncInitialState;
	readonly projObAsync$ = this._projOb$.pipe(mapAsyncState());

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
			next: (proj) => {
				console.warn(`subscribe: next`); // LOG
				this.projSub = proj;
			},
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

function transformHttpClientError(error: HttpErrorResponse) {
	if (error.status === 0) return new Error("Network error", { cause: error });
	// return {
	//   status: 0,
	//   message: "Network error — check your connection and try again.",
	//   raw: error.error,
	// };

	const msg = getErrorMessage(error.error);
	return new Error(msg, { cause: error });
}

/* DEMO
 * Errors
 * 1. Network error: fetch failure
 * 2. Http error: 400 bad request, 404 not found, 500 server error
 */
