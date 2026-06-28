import type * as React from "react";

// Ref: Show Component
// https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop
// https://github.com/romac/react-if/tree/master
// https://docs.solidjs.com/reference/components/show
interface ShowBaseProps<T> {
	when: T | false | null | undefined;
	fallback?: React.ReactNode;
}
interface ShowPropsWithChildren<T> extends ShowBaseProps<T> {
	children: React.ReactNode | ((item: T) => React.JSX.Element);
	display?: never;
}
interface ShowPropsWithDisplay<T> extends ShowBaseProps<T> {
	children?: never;
	display: React.ReactNode | ((item: T) => React.JSX.Element);
}
type ShowProps<T> = ShowPropsWithChildren<T> | ShowPropsWithDisplay<T>;

/**
 * Conditionally renders a component otherwise renders an optional fallback component.
 * @description Takes as props a condition `when` to evaluate the render path, either
 * `children` or `display` to render in the 'truthy' case, and optionally a `fallback`
 * component to render in the 'falsely' case. The `children` or `display` prop can be
 * provided as a `ReactNode` or render callback function with access to the `when` prop.
 *
 * @example
 * // With 'children' as a 'ReactNode'
 * <Show when={note} fallback={<p>Loading...</p>}>
 *   <Note data={note} />
 * </Show>
 *
 * // With 'display' as a render callback that provides the 'when' value
 * <Show when={note} display={(note) => <Note data={note} />} />
 */
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
