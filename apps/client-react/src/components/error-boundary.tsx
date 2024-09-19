import * as React from "react";

type ErrorBoundaryFallbackComponentProps = { error: unknown };

type ErrorBoundaryBaseProps = React.PropsWithChildren<{
	onError?: (error: unknown, info?: React.ErrorInfo) => void;
}>;
type ErrorBoundaryPropsWithFallback = ErrorBoundaryBaseProps & {
	fallback: React.ReactElement<
		unknown,
		string | React.FunctionComponent | typeof React.Component
	> | null;
	FallbackComponent?: never;
};
type ErrorBoundaryPropsWithComponent = ErrorBoundaryBaseProps & {
	fallback?: never;
	FallbackComponent: React.ComponentType<ErrorBoundaryFallbackComponentProps>;
};
type ErrorBoundaryProps =
	| ErrorBoundaryPropsWithFallback
	| ErrorBoundaryPropsWithComponent;

type ErrorBoundaryState =
	| { didCatch: true; error: unknown }
	| { didCatch: false; error: null };
const errorBoundaryInitialState: ErrorBoundaryState = { didCatch: false, error: null };

// Ref:
// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
// https://github.com/bvaughn/react-error-boundary
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
