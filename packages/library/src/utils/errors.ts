// ----------------------------------------------------------------------------------- //
// #region - Error as Value
// Ref: https://twitter.com/mattpocockuk/status/1824437662515614176

/** Class representing a failure. */
export class Failure<E = unknown> {
	readonly ok = false;
	readonly error: E;

	/**
	 * Create a Failure instance.
	 * @param error Error to describe the failure
	 */
	constructor(error: E) {
		this.error = error;
	}
}
/** Class representing a success. */
export class Success<T> {
	readonly ok = true;
	readonly value: T;

	/**
	 * Create a Success instance.
	 * @param value Value aligned to the success
	 */
	constructor(value: T) {
		this.value = value;
	}
}

// export function failure<E = unknown>(error: E) {
// 	return new Failure(error);
// }
// export function success<T>(value: T) {
// 	return new Success(value);
// }

// #endregion

// ----------------------------------------------------------------------------------- //
// #region - Error Handling

/**
 * Attempts to get an error message from an error (instance or value).
 * @param error `Error` instance or value
 * @param config Optional configuration controls
 * @returns Error message, stringify-ed error, or default message
 */
// Ref: https://github.com/epicweb-dev/epic-stack/blob/main/app/utils/misc.tsx
export function getErrorMessage(
	error: unknown,
	config = { stringifyUnknownError: false }
): string {
	if (typeof error === "string") return error;
	if (
		error &&
		typeof error === "object" &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return error.message;
	}

	console.error("Unable to get error message from error", error);
	return config.stringifyUnknownError ? JSON.stringify(error) : "Unknown Error";
}

/**
 * Wraps a function in `try`/`catch`/`finally` to enable safe execution (i.e. catch
 * errors/exceptions and return error or result in a `Failure`/`Success` discriminator).
 * @param func Function to wrap in safe execution
 * @param onCatch Function to execute on caught error/exception
 * @param onFinally Function to execute on completion
 * @returns Safe executable version of `func`
 */
// Ref: https://twitter.com/mattpocockuk/status/1633064377518628866
export function makeSafe<TArgs extends unknown[], TReturn>(
	func: (...args: TArgs) => TReturn,
	onCatch = (err: unknown) => {},
	onFinally = () => {}
) {
	return (...args: TArgs) => {
		try {
			const value = func(...args);
			return new Success(value);
		} catch (err) {
			onCatch(err);
			return new Failure(err);
		} finally {
			onFinally();
		}
	};
}
