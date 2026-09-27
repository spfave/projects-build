export class FetchError extends Error {
	override readonly name = FetchError.name;

	constructor(message = "Fetch failed", options?: ErrorOptions) {
		super(message, options);
	}
}

export class FetchResponseError extends Error {
	override readonly name = FetchResponseError.name;

	constructor(message = "Fetch response not ok", options?: ErrorOptions) {
		super(message, options);
	}
}

type HttpResponseErrorContext = {
	message?: string;
	status: number;
	statusText: string;
	url: string;
};
type ResponseMetadataKeys = "status" | "statusText" | "url";
type ResponseMetadata = { [K in ResponseMetadataKeys]: Response[K] | null | undefined };
export class HttpResponseError extends Error {
	override readonly name = HttpResponseError.name;
	readonly context: HttpResponseErrorContext;

	constructor(response: ResponseMetadata, message?: string, options?: ErrorOptions) {
		const status = response.status ?? NaN;
		const statusText = response.statusText ?? "Unknown Status";
		const url = response.url ?? "Unknown URL";
		const defaultMsg = `${Number.isNaN(status) ? "" : `${status} `}(${statusText}) request ${url}`;
		const errMsg = message ? `${message} - ${defaultMsg}` : defaultMsg;

		super(errMsg, options);
		this.context = {
			message,
			status: status,
			statusText: statusText,
			url: url,
		};
	}
}
