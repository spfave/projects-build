import type { RecordStr } from "#types";

// Ref: https://github.com/omniti-labs/jsend
export type JSend<TData extends RecordStr> =
	| { status: "success"; data: TData }
	| { status: "fail"; message?: string; data?: TData }
	| { status: "error"; message: string; data?: TData; code?: number };

export function jSend<TData extends RecordStr>(opts: JSend<TData>): JSend<TData> {
	return opts;
}
