import type { Observable, OperatorFunction } from "rxjs";
import { BehaviorSubject, catchError, defer, map, of, startWith, tap } from "rxjs";

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
// #region - Async Observable to Signal Utilities
// export function toAsyncState<T>(queryFn: () => Observable<T>) {}
// export function toQuerySignal<T>(queryFn: () => Observable<T>) {}
// export function toMutationSignal(){}

// #endregion

// ----------------------------------------------------------------------------------- //
// #region - Async Observable Utilities
// Distinct tracking for observable and associated async metadata
export type AsyncOperation<TValue = unknown> = {
	value$: Observable<TValue | null>;
	state$: Observable<AsyncState<TValue>>;
};

export function trackAsyncState<T>(source$: Observable<T>): AsyncOperation<T> {
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

// type MapObservable<T extends RecordGen> = {
// 	[K in keyof T as `${K & string}$`]: Observable<T[K]>;
// };
// export type AsyncState$<TValue = unknown> = MapObservable<AsyncState<TValue>>;

// Unified tracking for observable async state with metadata
export function mapAsyncStateThrow<T>(): OperatorFunction<T, AsyncState<T>> {
	return (source$: Observable<T>): Observable<AsyncState<T>> => {
		return source$.pipe(
			map((value) => ({ status: "resolved", value, error: null }) as const),
			catchError((error) => {
				throw error;
			}),
			startWith(asyncInitialState as AsyncState<T>)
		);
	};
}

export function mapAsyncWrapError<T>(): OperatorFunction<AsyncState<T>, AsyncState<T>> {
	return (source$: Observable<AsyncState<T>>): Observable<AsyncState<T>> => {
		return source$.pipe(
			catchError((error) => {
				return of({ status: "error", value: null, error } as AsyncState<T>);
			})
		);
	};
}

export function mapAsyncState<T>(): OperatorFunction<T, AsyncState<T>> {
	return (source$: Observable<T>): Observable<AsyncState<T>> => {
		return source$.pipe(mapAsyncStateThrow(), mapAsyncWrapError());
	};
}

// #endregion
