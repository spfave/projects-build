import { NgTemplateOutlet } from "@angular/common";
import { Component, computed, inject, input, type TemplateRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { HttpResponseError } from "@projectsbuild/library/errors";
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

// http response error custom handler
type ErrorFallbackParams = Record<string, string | undefined>;
type HttpResponseErrorHandlerContext = {
	error: HttpResponseError;
	params: ErrorFallbackParams;
};
type HttpResponseErrorTemplateContext = HttpResponseErrorHandlerContext & {
	$implicit: HttpResponseError;
};
type HttpResponseErrorHandler = (
	info: HttpResponseErrorHandlerContext
) => TemplateRef<HttpResponseErrorTemplateContext>;

// unexpected error custom handler
type UnexpectedErrorTemplateContext = {
	error: unknown;
	$implicit: unknown;
};
type UnexpectedErrorHandler =
	| TemplateRef<UnexpectedErrorTemplateContext>
	| ((error: unknown) => TemplateRef<UnexpectedErrorTemplateContext>);

type FallbackTemplate = {
	template: TemplateRef<unknown>;
	context:
		| { error: unknown; $implicit: unknown }
		| { error: unknown; params: ErrorFallbackParams; $implicit: unknown };
	// context: Record<string, unknown>;
};

@Component({
	selector: "pb-general-error-fallback",
	imports: [DefaultErrorFallback, DefaultHttpResponseErrorFallback, NgTemplateOutlet],
	template: `
		@let fallback = customFallback();
		@if (fallback) {
			<ng-container
				[ngTemplateOutlet]="fallback.template"
				[ngTemplateOutletContext]="fallback.context"
			/>
		} @else if (isHttpResponseError()) {
			<pb-default-http-error-fallback [error]="httpResponseError()!" />
		} @else {
			<pb-default-error-fallback [error]="error()" />
		}
	`,
})
export class GeneralErrorFallback {
	// inputs
	public readonly error = input.required<unknown>();
	public readonly httpResponseErrorHandlers =
		input<Record<number, HttpResponseErrorHandler>>();
	public readonly defaultHttpResponseErrorHandler = input<HttpResponseErrorHandler>();
	public readonly unexpectedErrorHandler = input<UnexpectedErrorHandler>();

	// params
	readonly #route = inject(ActivatedRoute);
	protected readonly params = computed<ErrorFallbackParams>(() => {
		const paramMap = this.#route.snapshot.paramMap;
		return Object.fromEntries(
			paramMap.keys.map((key) => [key, paramMap.get(key) ?? undefined])
		);
	});

	// custom fallback handling
	protected readonly customFallback = computed<FallbackTemplate | undefined>(() => {
		const error = this.error();
		const params = this.params();

		if (error instanceof HttpResponseError) {
			const handler =
				this.httpResponseErrorHandlers()?.[error.context.status] ??
				this.defaultHttpResponseErrorHandler();
			if (!handler) return undefined;

			return {
				template: handler({ error, params }),
				context: { $implicit: error, error, params },
			};
		}

		const handler = this.unexpectedErrorHandler();
		if (!handler) return undefined;
		const template = typeof handler === "function" ? handler(error) : handler;

		return {
			template,
			context: { $implicit: error, error },
		};
	});

	// HttpResponseError utils
	protected readonly isHttpResponseError = computed(
		() => this.error() instanceof HttpResponseError
	);
	protected readonly httpResponseError = computed(() => {
		const error = this.error();
		return error instanceof HttpResponseError ? error : undefined;
	});
}
