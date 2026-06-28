import * as React from "react";

// Ref: Error Boundary Component
// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
// https://github.com/bvaughn/react-error-boundary
// https://docs.solidjs.com/reference/components/error-boundary
interface ErrorBoundaryFallbackComponentProps {
	error: unknown;
}

interface ErrorBoundaryBaseProps
	extends React.PropsWithChildren<{
		onError?: (error: unknown, info?: React.ErrorInfo) => void;
	}> {}
interface ErrorBoundaryPropsWithFallback extends ErrorBoundaryBaseProps {
	fallback: React.ReactNode | ((error: unknown) => React.JSX.Element);
	FallbackComponent?: never;
}
interface ErrorBoundaryPropsWithComponent extends ErrorBoundaryBaseProps {
	fallback?: never;
	FallbackComponent: React.ComponentType<ErrorBoundaryFallbackComponentProps>;
}
type ErrorBoundaryProps =
	| ErrorBoundaryPropsWithFallback
	| ErrorBoundaryPropsWithComponent;

type ErrorBoundaryState =
	| { didCatch: true; error: unknown }
	| { didCatch: false; error: null };
const errorBoundaryInitialState: ErrorBoundaryState = { didCatch: false, error: null };

/**
 * Catches uncaught errors inside components and renders a fallback component in its place.
 *
 * Takes as props either `fallback` or `FallbackComponent` and optionally an `onError`
 * callback function. The `fallback` prop can be provided as either a `ReactNode` or render
 * callback function. The`FallbackComponent` prop must be a `React.ComponentType`.
 *
 * @example
 * // With 'fallback' as a 'ReactNode'
 * <ErrorBoundary
 *   fallback={<div>Whoops Error</div>}
 *   onError={(error, info) => console.log(error, info)}
 * >...</ErrorBoundary>
 *
 * // With 'fallback' as a render callback that provides the error
 * <ErrorBoundary fallback={(err) => <ErrorFallback error={err} />}>
 *   <Child />
 * </ErrorBoundary>
 *
 * // With 'FallbackComponent'
 * <ErrorBoundary FallbackComponent={ErrorFallback}>...</ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = errorBoundaryInitialState;
	}

	static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
		return { didCatch: true, error };
	}

	override componentDidCatch(error: unknown, info: React.ErrorInfo) {
		console.error("Error Boundary caught error: ", error, info);
		this.props.onError?.(error, info); // e.g. logErrorToService
	}

	override render() {
		if (this.state.didCatch) {
			if (this.props.FallbackComponent) {
				const fallbackProps: ErrorBoundaryFallbackComponentProps = {
					error: this.state.error,
				};
				return React.createElement(this.props.FallbackComponent, fallbackProps);
			}
			if (typeof this.props.fallback === "function") {
				return this.props.fallback(this.state.error);
			}
			if (this.props.fallback === null || React.isValidElement(this.props.fallback)) {
				return this.props.fallback;
			}
		}

		return this.props.children;
	}
}

// type ErrorBoundaryContextType = { error: unknown };
// const ErrorBoundaryContext = React.createContext<ErrorBoundaryContextType | null>(null);
// export function useErrorBoundaryError() {
// 	return React.useContext(ErrorBoundaryContext);
// }
