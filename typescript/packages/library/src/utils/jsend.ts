import type { RecordStr } from "#types";

// Ref: https://github.com/omniti-labs/jsend
type JSendSuccess<TData> = { status: "success"; data: TData };
type JSendFail<TData> = {
	status: "fail";
	message?: string;
	data?: TData;
};
type JSendError<TData> = {
	status: "error";
	message: string;
	data?: TData;
	code?: number;
};
export type JSend<TData extends RecordStr> =
	| JSendSuccess<TData>
	| JSendFail<TData>
	| JSendError<TData>;

// Use function overloads to narrow return type to specific JSend type
export function jSend<TData>(opts: JSendSuccess<TData>): JSendSuccess<TData>;
export function jSend<TData>(opts: JSendFail<TData>): JSendFail<TData>;
export function jSend<TData>(opts: JSendError<TData>): JSendError<TData>;
export function jSend<TData extends RecordStr>(opts: JSend<TData>): JSend<TData> {
	return opts;
}
