import * as React from "react";

export function useSafeDispatch<TAction>(dispatch: React.Dispatch<TAction>) {
	const mountedRef = React.useRef(false);

	React.useLayoutEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	return React.useCallback(
		(action: TAction) => (mountedRef.current ? dispatch(action) : void 0),
		[dispatch]
	);
}

// Ref: useAsync
// https://github.com/kentcdodds/bookshelf/blob/main/src/utils/hooks.js
// https://github.com/kentcdodds/bookshelf/issues/127
// https://kentcdodds.com/blog/how-to-use-react-context-effectively
// https://headbutt.io/picking-apart-kents-useasync/
// https://tanstack.com/query/latest
export type AsyncState<TData = unknown> =
	| { status: "PENDING"; data: null; error: null }
	| { status: "FULFILLED"; data: TData; error: null }
	| { status: "ERROR"; data: null; error: unknown };
export type AsyncStatus = AsyncState["status"];
export type AsyncAction<TData> =
	| { type: "PENDING" }
	| { type: "FULFILLED"; data: TData }
	| { type: "ERROR"; error: unknown }
	| { type: "RESET"; initialState?: AsyncState<TData> };
const asyncInitialState: AsyncState = { status: "PENDING", data: null, error: null };

export function asyncReducer<TData>(
	state: AsyncState<TData>,
	action: AsyncAction<TData>
): AsyncState<TData> {
	switch (action.type) {
		case "PENDING":
			return { status: "PENDING", data: null, error: null };
		case "FULFILLED":
			return { status: "FULFILLED", data: action.data, error: null };
		case "ERROR":
			return { status: "ERROR", data: null, error: action.error };
		case "RESET":
			return action?.initialState ?? (asyncInitialState as AsyncState<TData>);
		default:
			return state;
	}
}

export function useAsync<TData>(initialState?: AsyncState<TData>) {
	const initialStateRef = React.useRef<AsyncState<TData>>({
		...(asyncInitialState as AsyncState<TData>),
		...initialState,
	});

	const [state, unsafeDispatch] = React.useReducer(
		asyncReducer<TData>,
		initialStateRef.current
	);
	const safeDispatch = useSafeDispatch(unsafeDispatch);

	const setData = React.useCallback(
		(data: TData) => safeDispatch({ type: "FULFILLED", data }),
		[safeDispatch]
	);
	const setError = React.useCallback(
		(error: unknown) => safeDispatch({ type: "ERROR", error }),
		[safeDispatch]
	);
	const reset = React.useCallback(
		() => safeDispatch({ type: "RESET", initialState: initialStateRef.current }),
		[safeDispatch]
	);

	const run = React.useCallback(
		async (promise: Promise<TData>) => {
			if (!promise || !promise.then)
				throw new Error("The argument passed to useAsync().run must be a promise.");

			safeDispatch({ type: "PENDING" });
			try {
				const data = await promise;
				setData(data);
				return data;
			} catch (error) {
				setError(error);
				return await Promise.reject(error);
			}
		},
		[safeDispatch, setData, setError]
	);

	return {
		status: state.status,
		data: state.data,
		error: state.error,
		setData,
		setError,
		reset,
		run,
		isPending: state.status === "PENDING",
		isFulfilled: state.status === "FULFILLED",
		isError: state.status === "ERROR",
	};
}

export function useQuery<TData>(queryFn: () => Promise<TData>) {
	const query = useAsync<TData>();

	const cbQueryFn = React.useCallback(queryFn, []);
	const refetch = React.useCallback(() => query.run(cbQueryFn()), [query.run, cbQueryFn]);

	React.useEffect(() => {
		refetch();
	}, [refetch]);

	return {
		status: query.status,
		data: query.data,
		error: query.error,
		refetch,
		isPending: query.status === "PENDING",
		isFulfilled: query.status === "FULFILLED",
		isError: query.status === "ERROR",
	};
}

/**
 * @deprecated Created for illustration, not recommended for use
 */
export function useFetch<TData = unknown>(
	input: string | URL | globalThis.Request,
	init?: RequestInit,
	handleHttpErrors?: (status: number) => void
) {
	const [state, dispatch] = React.useReducer(
		asyncReducer<TData>,
		asyncInitialState as AsyncState<TData>
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Challenging to properly "memoize" dependencies
	React.useEffect(() => {
		const controller = new AbortController();
		const abortSignals = [controller.signal, ...(init?.signal ? [init.signal] : [])];

		async function runFetch() {
			const res = await fetch(input, {
				...init,
				signal: AbortSignal.any(abortSignals),
			}).catch((err) => {
				throw Error("No connection", { cause: err });
			});

			handleHttpErrors?.(res.status);
			if (!res.ok) throw new Error("Fetch failed");

			return res.json() as TData;
		}

		dispatch({ type: "PENDING" });
		runFetch()
			.then((data) => dispatch({ type: "FULFILLED", data }))
			.catch((error) => dispatch({ type: "ERROR", error }));

		return () => controller.abort("Cancel request");
	}, []); // [input, init, handleHttpErrors] - ?? how to memo complex objects/classes: input, init

	return {
		status: state.status,
		data: state.data,
		error: state.error,
		isPending: state.status === "PENDING",
		isFulfilled: state.status === "FULFILLED",
		isError: state.status === "ERROR",
	};
}
