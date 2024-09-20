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
/**
 * Conditionally renders a component otherwise renders an optional fallback component.
 * @description Takes a `when` prop to evaluate the render path and either a `children`
 * or `display` prop to render in the 'truthy' case and a optional `fallback` prop in the
 * 'falsely' case. The `children` or `display` prop can be provided as a `ReactNode` or
 * callback function with access to the `when` prop.
 *
 * @example
 * // With composition based 'React.ReactNode' children prop
 * <Show when={data} fallback={<p>Loading...</p>}>
 *   <Child />
 * </Show>
 *
 * // With input based callback function display prop that provides the 'when' value
 * <Show when={data} display={(data) => <DataList data={data} />} />
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
