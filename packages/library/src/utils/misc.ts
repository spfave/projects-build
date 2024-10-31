// Use function overload to get inferred result type
/**
 * Evaluates a value as truthy or falsely for determining the return value.
 * @param input Value to evaluate as truthy/falsely
 * @returns `input` if truthy otherwise `undefined`
 *
 * @example
 * valueIfTruthy(0); // returns undefined
 * valueIfTruthy(1); // returns 1
 */
export function valueIfTruthy<TInput>(input: TInput): TInput | undefined;
/**
 * Evaluates a value as truthy or falsely for determining the return value.
 * @param input Value to evaluate as truthy/falsely
 * @param output Value to return if `input` is truthy
 * @returns `output` if `input` is truthy otherwise `undefined`
 *
 * @example
 * valueIfTruthy(0, "0"); // returns undefined
 * valueIfTruthy(1, "1"); // returns "1"
 */
export function valueIfTruthy<TInput, TOutput extends {}>(
	input: TInput,
	output: TOutput
): TOutput | undefined;
export function valueIfTruthy<TInput, TOutput>(input: TInput, output?: TOutput) {
	if (!input) return undefined;
	return output ?? input;
}

// /**
//  * Execute and return callback result if input is "truthy" otherwise execution is void.
//  * @param input evaluate to truthy or falsely
//  * @param cb callback to execute
//  * @param [args] optional arguments to callback
//  */
// export function actionIfTruthy<TInput, TCallback extends FuncWithoutParams<TCallback>>(
// 	input: TInput,
// 	cb: TCallback
// ): ReturnType<TCallback> | undefined;
// export function actionIfTruthy<TInput, TCallback extends FuncWithParams<TCallback>>(
// 	input: TInput,
// 	cb: TCallback,
// 	args: [...Parameters<TCallback>]
// ): ReturnType<TCallback> | undefined;
// export function actionIfTruthy<
// 	TInput,
// 	TCallback extends FuncWithoutParams<TCallback> | FuncWithParams<TCallback>,
// >(input: TInput, cb: TCallback, args?: [...Parameters<TCallback>]) {
// 	if (!input) return;
// 	return args ? cb(...args) : cb();
// }

// // biome-ignore lint/suspicious/noExplicitAny: in type extends clause
// export type FuncWithoutParams<TFunc extends () => any> = () => ReturnType<TFunc>;
// // biome-ignore lint/suspicious/noExplicitAny: in type extends clause
// export type FuncWithParams<TFunc extends (...args: any[]) => any> = (
// 	...args: Parameters<TFunc>
// ) => ReturnType<TFunc>;

// // --------------- TESTING --------------------
// function func1(p: number) {
// 	console.warn(p); //LOG
// 	return p * 2;
// }
// function func2() {
// 	console.warn(123); //LOG
// 	return "fsf";
// }
// type f2p = Parameters<typeof func2>;

// const tmp = actionIfTruthy(true, func1, [12]);
// const tmp2 = actionIfTruthy(true, func2);
