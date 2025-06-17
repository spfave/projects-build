import type React from "react";
import { useParams } from "react-router";

import { HttpResponseError } from "@projectsbuild/library/errors";
import { getErrorMessage } from "@projectsbuild/library/utils";
import Show from "./ui/show";

import styles from "./error-fallback.module.css";

type DefaultErrorFallbackProps = { error: unknown };
export function DefaultErrorFallback(props: DefaultErrorFallbackProps) {
	const { error } = props;

	const message =
		error instanceof Error ? `${error.name}: ${error.message}` : getErrorMessage(error);

	return (
		<div className={styles.errorFallback}>
			<p>An Error Occurred</p>
			<p>
				<samp>{message}</samp>
			</p>
		</div>
	);
}

type DefaultHttpResponseErrorFallbackProps = { error: HttpResponseError };
export function DefaultHttpResponseErrorFallback(
	props: DefaultHttpResponseErrorFallbackProps
) {
	const { error } = props;
	return (
		<div className={styles.errorFallback}>
			<p>A HTTP Response Error Occurred</p>
			<p>
				<Show when={error.context.message}>
					<samp>Error Message: {error.context.message}</samp>
					<br />
				</Show>
				<samp>
					Response Status: {error.context.status} ({error.context.statusText})
				</samp>
				<br />
				<samp>Request URL: {error.context.url}</samp>
			</p>
		</div>
	);
}

// Ref: General Error Fallback Component
// https://github.com/epicweb-dev/epic-stack/blob/main/app/components/error-boundary.tsx
type HttpResponseErrorHandler = (info: {
	error: HttpResponseError;
	params: Record<string, string | undefined>;
}) => React.JSX.Element;
type GeneralErrorFallbackProps = {
	error: unknown;
	httpResponseErrorHandlers?: Record<string, HttpResponseErrorHandler>;
	defaultHttpResponseErrorHandler?: HttpResponseErrorHandler;
	unexpectedErrorHandler?: React.ReactNode | ((error: unknown) => React.JSX.Element);
};
export default function GeneralErrorFallback(props: GeneralErrorFallbackProps) {
	const {
		error,
		httpResponseErrorHandlers,
		defaultHttpResponseErrorHandler,
		unexpectedErrorHandler,
	} = props;
	const params = useParams();

	if (error instanceof HttpResponseError) {
		return (
			// biome-ignore format: single line per case
			httpResponseErrorHandlers?.[error.context.status]?.({ error, params })
				?? defaultHttpResponseErrorHandler?.({ error, params }) 
				?? <DefaultHttpResponseErrorFallback error={error} />
		);
	}

	if (unexpectedErrorHandler) {
		return typeof unexpectedErrorHandler === "function"
			? unexpectedErrorHandler(error)
			: unexpectedErrorHandler;
	}

	return <DefaultErrorFallback error={error} />;
}
