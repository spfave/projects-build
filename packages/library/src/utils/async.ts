import { Failure, Success } from "./errors";

// ----------------------------------------------------------------------------------- //
// #region - General Async Utilities

// export function isFunctionAsync(func: (...args: unknown[]) => unknown) {
// 	func.constructor.name === "AsyncFunction";
// }

/**
 * Delays execution for a set duration of time.
 * @param duration Wait duration in milliseconds
 * @returns Void `Promise` from which to continue execution
 *
 * @example
 * wait(1000).then(() => console.log("delayed")); // console logs "delay" after 1000 ms
 */
export async function wait(duration: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, duration));
}

// #endregion

// ----------------------------------------------------------------------------------- //
// #region - Async/Promise Handling

/**
 * Safely executes an async function in `try`/`catch`/`finally` to return result or error
 * as value.
 * @param asyncFunc Async function to execute
 * @param onCatch Function to execute on caught error/exception
 * @param onFinally Function to execute on completion
 * @returns `asyncFunc` result wrapped in a `Failure`/`Success` discriminator
 */
export async function safeAsync<TError = unknown, TPromise = unknown>(
	asyncFunc: () => Promise<TPromise>,
	onCatch = (err: unknown) => {},
	onFinally = () => {}
) {
	try {
		const value = await asyncFunc().catch((err) => {
			throw err;
		});
		return new Success(value);
	} catch (err) {
		onCatch(err);
		return new Failure(err as TError);
	} finally {
		onFinally();
	}
}
fetch("input").then().catch().finally();

/**
 * Safely awaits a promise to return result or error as value.
 * @param promise Promise to resolve
 * @returns `promise` result wrapped in a `Failure`/`Success` discriminator
 */
export async function safePromise<TError = unknown, TPromise = unknown>(
	promise: Promise<TPromise>
) {
	const pSettled = (await Promise.allSettled([promise]))[0];

	return pSettled.status === "fulfilled" // 'fulfilled' | 'rejected'
		? new Success(pSettled.value)
		: new Failure(pSettled.reason as TError);
}

// #endregion
new Promise((params) => {});
