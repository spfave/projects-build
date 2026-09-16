import { Component, computed, input } from "@angular/core";

import type { HttpResponseError } from "@projectsbuild/library/errors";
import { getErrorMessage } from "@projectsbuild/library/utils";

@Component({
	selector: "pb-default-error-fallback",
	imports: [],
	template: `
		<div>
			<p>An Error Occurred</p>
			<p>
				<samp>{{ message() }}</samp>
			</p>
		</div>
	`,
	styleUrl: "./error-fallback.css",
})
export class DefaultErrorFallback {
	public readonly error = input.required();
	protected readonly message = computed(() => {
		const error = this.error();
		return error instanceof Error
			? `${error.name}: ${error.message}`
			: getErrorMessage(error);
	});
}

@Component({
	selector: "pb-default-http-error-fallback",
	imports: [],
	template: `
		<div>
			<p>A HTTP Response Error Occurred</p>
			<p>
				@if (error().context.message) {
					<samp>Error Message: {{ error().context.message }}</samp>
				}
				<samp>
					Response Status: {{ error().context.status }} ({{ error().context.statusText }})
				</samp>
				<samp>Request URL: {{ error().context.url }}</samp>
			</p>
		</div>
	`,
	styleUrl: "./error-fallback.css",
})
export class DefaultHttpResponseErrorFallback {
	public readonly error = input.required<HttpResponseError>();
}
