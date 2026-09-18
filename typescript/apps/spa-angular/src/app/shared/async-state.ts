import {
	type HttpResourceOptions,
	type HttpResourceRef,
	type HttpResourceRequest,
	httpResource,
} from "@angular/common/http";
import { computed, type ResourceParamsContext, type Signal, signal } from "@angular/core";
import type { Observable, ObservedValueOf, OperatorFunction } from "rxjs";
import { BehaviorSubject, catchError, defer, map, of, startWith, tap } from "rxjs";

// ----------------------------------------------------------------------------------- //
// #region - Resource Signal Wrappers

type HttpResourceRequestFn = (
	ctx: ResourceParamsContext
) => HttpResourceRequest | undefined;
interface HttpResourceRefWithMappedError<T, E extends Error = Error>
	extends HttpResourceRef<T> {
	cError: Signal<E | undefined>;
}

// Note: Requires TS function overloads to match httpResource api overloads
export function createHttpResourceWithMappedError<T, E extends Error = Error>(
	request: HttpResourceRequestFn,
	mapError: (error: Error) => E,
	options: HttpResourceOptions<T, unknown> & { defaultValue: NoInfer<T> }
): HttpResourceRefWithMappedError<T, E>;
export function createHttpResourceWithMappedError<T, E extends Error = Error>(
	request: HttpResourceRequestFn,
	mapError: (error: Error) => E,
	options?: HttpResourceOptions<T, unknown>
): HttpResourceRefWithMappedError<T | undefined, E>;
/**
 * @deprecated Prefer `mapHttpResourceError`, which supports full `httpResource` API.
 *
 * Wraps Angular httpResource() to support an error transform.
 * @param request Same as `httpResource()` request parameter
 * @param mapError An error transform function
 * @param options Same as `httpResource()` options parameter
 * @returns `HttpResourceRef` with additional signal `cError` providing transformed error
 */
export function createHttpResourceWithMappedError<T, E extends Error = Error>(
	request: HttpResourceRequestFn,
	mapError: (error: Error) => E,
	options?: HttpResourceOptions<T, unknown>
): HttpResourceRefWithMappedError<T | undefined, E> {
	const hr = httpResource<T>(request, options);
	const cError = computed(() => {
		const err = hr.error();
		return err ? mapError(err) : undefined;
	});
	return Object.assign(hr, { cError });
}

// DEMO: httpResourceReqMapError like httpResource only works within an injection context at runtime
// const _demo = createHttpResourceWithMappedError<string[]>(
// 	() => ({ url: `` }),
// 	(e) => {
// 		if (e instanceof HttpErrorResponse) return new Error("msg", { cause: e });
// 		return e;
// 	},
// 	{ defaultValue: [] }
// );

/**
 * Wraps the provided `httpResource` result to support a custom error transform.
 * Adds a custom error transform to the provided `httpResource` result.
 * @param httpResourceRef Result of `httpResource()` call
 * @param mapError An error transform function
 * @returns `HttpResourceRef` with additional signal `cError` providing transformed error
 */
export function mapHttpResourceError<T, E extends Error = Error>(
	httpResourceRef: HttpResourceRef<T>,
	mapError: (error: Error) => E
): HttpResourceRefWithMappedError<T, E> {
	const cError = computed(() => {
		const err = httpResourceRef.error();
		return err ? mapError(err) : undefined;
	});
	return Object.assign(httpResourceRef, { cError });
}

// DEMO
// const _demo2 = mapHttpResourceError(
// 	httpResource<string[]>(() => ({ url: `` }), { defaultValue: [] }),
// 	(e) => {
// 		if (e instanceof HttpErrorResponse) return new Error("msg", { cause: e });
// 		return e;
// 	}
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
	status: "idle",
	value: null,
	error: null,
};

// ----------------------------------------------------------------------------------- //
// #region - Async Observable to Signal Transforms
// Ref: https://chatgpt.com/share/6a7a34f7-02d8-83ea-852a-f73d6effcb3d

// export function toAsyncState<T>(source$: Observable<T>) {}
// export function toQuerySignal<T>(source$: Observable<T>) {}
// export function toMutationSignal<T>(){}

// Prefer factory version
export function createAsyncStateFromObservable<T>() {
	const state = signal<AsyncState<T>>({ status: "idle", value: null, error: null });

	function execute<E extends Error = Error>(
		source$: Observable<T>,
		mapError: (error: Error) => E
	) {
		state.set({ status: "loading", value: null, error: null });
		return source$.pipe(
			tap({
				next: (value) => state.set({ status: "resolved", value, error: null }),
				error: (error) =>
					state.set({ status: "error", value: null, error: mapError(error) }),
			})
		);
	}

	return { state: state.asReadonly(), execute };
}

/**
 * Creates a signal that tracks the observable factory async state and provides an execute function
 * wrapping the factory that manages the async state on execution.
 * @param factory A function that returns an observable
 * @param mapError An error transform function
 * @returns An object containing the async state signal and an execute function to run the factory
 */
export function createAsyncStateForFactory<
	// biome-ignore lint/suspicious/noExplicitAny: use 'any' over 'unknown' to allow TS inference without error
	TFactory extends (...args: any[]) => Observable<any>,
	E extends Error = Error,
>(factory: TFactory, mapError: (error: Error) => E) {
	type TResult = ObservedValueOf<ReturnType<TFactory>>;
	const state = signal<AsyncState<TResult>>({
		status: "idle",
		value: null,
		error: null,
	});

	function execute(...args: Parameters<TFactory>): Observable<TResult> {
		state.set({ status: "loading", value: null, error: null });
		return factory(...args).pipe(
			tap({
				next: (value) => state.set({ status: "resolved", value, error: null }),
				error: (error) =>
					state.set({ status: "error", value: null, error: mapError(error) }),
			})
		);
	}

	return { state: state.asReadonly(), execute };
}

// #endregion

// ----------------------------------------------------------------------------------- //
// #region - Async Observable Custom Pipe Operators

// Unified tracking for an async observable value and associated async state
/**
 * Tracks an observable and maps its emitted values to an `AsyncState` object.
 * If the observable errors, the error is thrown.
 * @returns An `OperatorFunction` that transforms an observable of type `T` into an observable of type `AsyncState<T>`
 * @throws The error from the source observable if it errors
 */
export function trackAsyncStateReThrow<T>(): OperatorFunction<T, AsyncState<T>> {
	return (source$: Observable<T>): Observable<AsyncState<T>> => {
		return source$.pipe(
			map((value) => ({ status: "resolved", value, error: null }) as const),
			catchError((error) => {
				throw error;
			}),
			startWith({ status: "loading", value: null, error: null } as const)
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
			trackAsyncStateReThrow(),
			catchError((error) => {
				return of({ status: "error", value: null, error } as AsyncState<T>);
			})
		);
	};
}

/**
 * Tracks an observable and maps its emitted values to an `AsyncState` object.
 * If the observable errors, the error is caught and transformed using the provided `mapError` function.
 * The transformed error is then mapped to an `AsyncState` with status "error".
 * @param mapError An error transform function
 * @returns
 */
export function trackAsyncStateWithMappedError<T, E extends Error = Error>(
	mapError: (error: Error) => E
): OperatorFunction<T, AsyncState<T>> {
	return (source$: Observable<T>): Observable<AsyncState<T>> => {
		return source$.pipe(
			trackAsyncStateReThrow(),
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
 * @deprecated Prefer observable `trackAsyncState...` pipe operators.
 *
 * Runs an observable tracking and managing its async state. Provides a value observable
 * and an async state observable.
 * @param source$ Observable to track
 * @returns `AsyncStateValuePair` containing value and async state observables
 */
export function createAsyncStatePairFromObservable<T>(
	source$: Observable<T>
): AsyncStateValuePair<T> {
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
