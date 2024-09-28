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
	status: number;
	statusText: string;
	url: string;
	message?: string;
};
export class HttpResponseError extends Error {
	override readonly name = HttpResponseError.name;
	readonly context: HttpResponseErrorContext;

	constructor(response: Response, message?: string, options?: ErrorOptions) {
		const defaultMsg = `${response.status} (${response.statusText}) request ${response.url}`;
		const errMsg = message ? `${message} - ${defaultMsg}` : defaultMsg;

		super(errMsg, options);
		this.context = {
			status: response.status,
			statusText: response.statusText,
			url: response.url,
			message,
		};
	}
}
