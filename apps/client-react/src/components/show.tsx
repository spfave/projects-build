import type * as React from "react";

type ShowBaseProps<T> = {
	when: T | false | null | undefined;
	fallback?: React.ReactNode;
};
type ShowPropsWithChildren<T> = ShowBaseProps<T> & {
	children: React.ReactNode | ((item: T) => React.JSX.Element);
	display?: never;
};
type ShowPropsWithDisplay<T> = ShowBaseProps<T> & {
	children?: never;
	display: React.ReactNode | ((item: T) => React.JSX.Element);
};
type ShowProps<T> = ShowPropsWithChildren<T> | ShowPropsWithDisplay<T>;

// Ref:
// https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop
// https://github.com/romac/react-if/tree/master
// https://docs.solidjs.com/reference/components/show
export default function Show<T>(props: ShowProps<T>) {
	const { when, children, display, fallback } = props;

	if (!when) return fallback;
	if (display) {
		if (typeof display === "function") return display(when);
		return display;
	}
	if (typeof children === "function") return children(when);
	return children;
}
