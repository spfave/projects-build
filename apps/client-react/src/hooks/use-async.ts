import * as React from "react";

export function useSafeDispatch<TAction>(dispatch: React.Dispatch<TAction>) {
	const refMounted = React.useRef(false);

	React.useLayoutEffect(() => {
		refMounted.current = true;
		return () => {
			refMounted.current = false;
		};
	}, []);

	return React.useCallback(
		(action: TAction) => (refMounted.current ? dispatch(action) : void 0),
		[dispatch]
	);
}

// Ref: asyncReducer & useAsync
// https://github.com/kentcdodds/bookshelf/blob/main/src/utils/hooks.js
// https://github.com/kentcdodds/bookshelf/issues/127
// https://kentcdodds.com/blog/how-to-use-react-context-effectively
// https://headbutt.io/picking-apart-kents-useasync/
// https://tanstack.com/query/latest
export type AsyncState<TData = unknown> =
	| { status: "IDLE"; data: null; error: null }
	| { status: "PENDING"; data: null; error: null }
	| { status: "FULFILLED"; data: TData; error: null }
	| { status: "ERROR"; data: null; error: unknown };
export type AsyncStatus = AsyncState["status"];
export type AsyncAction<TData> =
	| { type: "IDLE" }
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
		case "IDLE":
			return { status: "IDLE", data: null, error: null };
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
				return Promise.reject(error);
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

// Ref:https://tanstack.com/query/latest/docs/framework/react/guides/queries
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
// Ref: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
// biome-ignore lint/suspicious/noExplicitAny: use 'any' over 'unknown' to allow TS inference without error
export function useMutation<TMutation extends (...args: any[]) => Promise<any>>(
	mutationFn: TMutation
) {
	const mutation = useAsync<ReturnType<TMutation>>({
		status: "IDLE",
		data: null,
		error: null,
	});

	function mutate(...args: Parameters<TMutation>) {
		return mutation.run(mutationFn(...args));
	}

	return {
		status: mutation.status,
		data: mutation.data,
		error: mutation.error,
		mutate,
		isIdle: mutation.status === "IDLE",
		isPending: mutation.status === "PENDING",
		isFulfilled: mutation.status === "FULFILLED",
		isError: mutation.status === "ERROR",
	};
}

// Ref: useFetch
// https://github.com/w3cj/use-x
type UseFetchOptions = { immediate: boolean };
const defaultFetchOptions: UseFetchOptions = { immediate: true };

/**
 * @deprecated Created as demo.
 */
export function useFetch<TData = unknown>(
	input: string | URL | globalThis.Request, // Parameters<typeof fetch>[0],
	init?: RequestInit, // Parameters<typeof fetch>[1],
	options?: UseFetchOptions
	// handleHttpErrors?: (status: number) => void
) {
	const refAbortController = React.useRef(new AbortController());
	const [fetchInput, updateFetchInput] = React.useState(input);
	const [fetchInit, updateFetchInit] = React.useState(init);
	const [fetchOptions, updateFetchOptions] = React.useState(
		options ?? defaultFetchOptions
	);
	const [state, unsafeDispatch] = React.useReducer(
		asyncReducer<TData>,
		asyncInitialState as AsyncState<TData>
	);
	const safeDispatch = useSafeDispatch(unsafeDispatch);

	const runFetch = React.useCallback(async () => {
		refAbortController.current.abort("AbortInFlight");
		refAbortController.current = new AbortController();

		safeDispatch({ type: "PENDING" });
		try {
			const res = await fetch(fetchInput, {
				...fetchInit,
				signal: AbortSignal.any([
					refAbortController.current.signal,
					...(fetchInit?.signal ? [fetchInit.signal] : []),
				]),
			});

			// handleHttpErrors?.(res.status);
			if (!res.ok) throw new Error("Fetch failed", { cause: res });

			const data = (await res.json()) as TData;
			safeDispatch({ type: "FULFILLED", data });
			return data;
		} catch (error) {
			// To handle caught aborted signal error
			if (!["AbortUnmount", "AbortInFlight"].includes(error as string)) {
				safeDispatch({ type: "ERROR", error });
			}
			// safeDispatch({ type: "ERROR", error });
			return Promise.reject(error);
		}
	}, [fetchInput, fetchInit, safeDispatch]);

	React.useEffect(() => {
		if (fetchOptions.immediate) runFetch();
		return () => refAbortController.current.abort("AbortUnmount");
	}, [runFetch, fetchOptions]);

	return {
		status: state.status,
		data: state.data,
		error: state.error,
		runFetch,
		updateFetchInput,
		updateFetchInit,
		updateFetchOptions,
		isPending: state.status === "PENDING",
		isFulfilled: state.status === "FULFILLED",
		isError: state.status === "ERROR",
	};
}
