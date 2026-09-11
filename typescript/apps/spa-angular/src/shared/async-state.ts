import { httpResource } from "@angular/common/http";
import { computed, type Signal } from "@angular/core";
import type { Observable, OperatorFunction } from "rxjs";
import { BehaviorSubject, catchError, defer, map, of, startWith, tap } from "rxjs";

// ----------------------------------------------------------------------------------- //
// #region - Resource Signal Wrappers

type ParametersHttpResourceFn<T> = Parameters<typeof httpResource<T>>;
type HttpResourceRequests<T> = ParametersHttpResourceFn<T>[0];
type HttpResourceOptions<T> = ParametersHttpResourceFn<T>[1];
interface HttpResourceRefWithComputedError<T> extends ReturnType<typeof httpResource<T>> {
	cError: Signal<Error | undefined>;
}

/**
 * Wraps Angular httpResource() to support a custom error transform function.
 * @param request same as `httpResource()` request parameter
 * @param mapError custom error transform function
 * @param options same as `httpResource()` options parameter
 * @returns `HttpResourceRef` with additional computed signal `cError` providing transformed error
 */
export function httpResourceMapError<T>(
	request: HttpResourceRequests<T>,
	mapError: (error: Error) => Error,
	options?: HttpResourceOptions<T>
): HttpResourceRefWithComputedError<T> {
	const hr = httpResource<T>(request, options);
	const cError = computed(() => {
		const err = hr.error();
		return err ? mapError(err) : undefined;
	});
	return { ...hr, cError };
}

// Note: For demo only. httpResourceMapError like httpResource only works within an injection context at runtime
// const _demo = httpResourceMapError(
// 	() => ({ url: `` }),
// 	(e) => {
// 		if (e instanceof HttpErrorResponse) return new Error("msg", { cause: e });
// 		return e;
// 	},
// 	{ defaultValue: [] }
// );

// #endregion

// Ref: https://angular.dev/guide/signals/resource#resource-status
export type AsyncState<TValue = unknown> =
	| { status: "idle"; value: null; error: null }
	| { status: "loading"; value: null; error: null }
	| { status: "resolved"; value: TValue; error: null }
	| { status: "error"; value: TValue | null; error: unknown };
export type AsyncStatus = AsyncState["status"];
export const asyncInitialState: AsyncState = {
	status: "loading",
	value: null,
	error: null,
};

// ----------------------------------------------------------------------------------- //
// #region - Async Observable to Signal Transforms
// export function toAsyncState<T>(queryFn: () => Observable<T>) {}
// export function toQuerySignal<T>(queryFn: () => Observable<T>) {}
// export function toMutationSignal(){}

// #endregion

// ----------------------------------------------------------------------------------- //
// #region - Async Observable Custom Pipe Operators

// Unified tracking for an async observable value and associated async state
/**
 * Tracks an observable and maps its emitted values to an `AsyncState` object.
 * If the observable errors, the error is thrown.
 * @returns An `OperatorFunction` that transforms an observable of type `T` into an observable of type `AsyncState<T>`.
 * @throws The error from the source observable if it errors.
 */
export function trackAsyncStateThrowError<T>(): OperatorFunction<T, AsyncState<T>> {
	return (source$: Observable<T>): Observable<AsyncState<T>> => {
		return source$.pipe(
			map((value) => ({ status: "resolved", value, error: null }) as const),
			catchError((error) => {
				console.info(`trackAsyncStateThrowError: `, error); // LOG
				throw error;
			}),
			startWith(asyncInitialState as AsyncState<T>)
		);
	};
}

/**
 * Tracks an observable and maps its emitted values to an `AsyncState` object.
 * If the observable errors, the error is caught and mapped to an `AsyncState` with status "error".
 * @returns
 */
export function trackAsyncState<T>(): OperatorFunction<T, AsyncState<T>> {
	return (source$: Observable<T>): Observable<AsyncState<T>> => {
		return source$.pipe(
			trackAsyncStateThrowError(),
			catchError((error) => {
				console.info(`trackAsyncStateMapError: `, error); // LOG
				return of({ status: "error", value: null, error } as AsyncState<T>);
			})
		);
	};
}

/**
 * Tracks an observable and maps its emitted values to an `AsyncState` object.
 * If the observable errors, the error is caught and transformed using the provided `mapError` function.
 * The transformed error is then mapped to an `AsyncState` with status "error".
 * @param mapError A function that takes an `Error` and returns a transformed `Error`.
 * @returns
 */
export function trackAsyncStateMapError<T>(
	mapError: (error: Error) => Error
): OperatorFunction<T, AsyncState<T>> {
	return (source$: Observable<T>): Observable<AsyncState<T>> => {
		return source$.pipe(
			trackAsyncStateThrowError(),
			catchError((error) => {
				return of({
					status: "error",
					value: null,
					error: mapError(error),
				} as AsyncState<T>);
			})
		);
	};
}

// Distinct tracking for an async observable value and associated async state
export type AsyncStateValuePair<TValue = unknown> = {
	value$: Observable<TValue | null>;
	state$: Observable<AsyncState<TValue>>;
};

/**
 * @deprecated Prefer custom observable pipe operators. Kept for reference
 *
 * Runs an observable tracking and managing its async state. Provides a value observable
 * and an async state observable.
 * @param source$ Observable to track
 * @returns `AsyncStateValuePair` containing value and state: `AsyncState` observables
 */
export function runAsyncObservable<T>(source$: Observable<T>): AsyncStateValuePair<T> {
	const _state = new BehaviorSubject<AsyncState<T>>(asyncInitialState as AsyncState<T>);

	const _value$ = defer(() => {
		_state.next({ status: "loading", value: null, error: null });
		return source$.pipe(
			tap({
				next: (value) => _state.next({ status: "resolved", value, error: null }),
				error: (error: unknown) =>
					_state.next({ status: "error", value: _state.value.value, error }),
			})
		);
	});

	return {
		value$: _value$,
		state$: _state.asObservable(),
	};
}

// #endregion
