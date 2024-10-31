import * as React from "react";

type ForBaseProps<TItem> = {
	array: TItem[] | false | null | undefined;
	getKey: (item: TItem) => React.Key;
	fallback?: React.ReactNode;
};
type ForPropsWithChildren<TItem> = ForBaseProps<TItem> & {
	children: (item: TItem) => React.JSX.Element;
	display?: never;
};
type ForPropsWithDisplay<TItem> = ForBaseProps<TItem> & {
	children?: never;
	display: (item: TItem) => React.JSX.Element;
};
type ForProps<TItem> = ForPropsWithChildren<TItem> | ForPropsWithDisplay<TItem>;

// Ref:
// https://docs.solidjs.com/reference/components/for
// https://www.youtube.com/watch?v=5s6dIkrv6Y4&list=PLL7pT-2dDRHgjTlmQAdnLpx9LxqWTGeO5
/**
 * Renders a component for each item in an array. If the array is empty renders an optional
 * fallback.
 * @description Takes as props an `array` to iterate through, a `getKey` callback to return
 * a key to uniquely identify each rendered item, either a `children` or `display` render
 * callback function, and optionally a `fallback` component. The render callback
 * provides the array item to the render callback.
 *
 * @example
 * // With 'children' render callback
 * <For array={notes} fallback={<p>No Notes Exist.</p>}>
 *   {(note, idx) => <p key={note.id}>{note.text}</p> }
 * </For>
 *
 * // With 'display' render callback
 * <For
 *   array={notes}
 *   display={(note) => <p>{note.text}</p>}
 *   getKey={(note) => note.id}
 *   fallback={<p>No Notes Exist.</p>}
 * />
 */
export default function For<TItem>(props: ForProps<TItem>) {
	const { array, getKey, children, display, fallback } = props;

	if (!array || array.length === 0) return fallback;
	if (display) {
		return array.map((item) => (
			<React.Fragment key={getKey(item)}>{display(item)}</React.Fragment>
		));
	}
	return array.map((item) => (
		<React.Fragment key={getKey(item)}>{children(item)}</React.Fragment>
	));
}

// ----------------------------------------------------------------------------------- //
// Extending Array type

// type ForBaseProps<TArray extends unknown[]> = {
// 	array: TArray;
// 	fallback?: React.ReactNode;
// };
// type ForPropsWithChildren<TArray extends unknown[]> = ForBaseProps<TArray> & {
// 	children: (item: TArray[number], index?: React.Key) => React.JSX.Element;
// 	display?: never;
// 	getKey?: never;
// };
// type ForPropsWithDisplay<TArray extends unknown[]> = ForBaseProps<TArray> & {
// 	children?: never;
// 	display: (item: TArray[number]) => React.JSX.Element;
// 	getKey: (item: TArray[number]) => React.Key;
// };
// type ForProps<TArray extends unknown[]> =
// 	| ForPropsWithChildren<TArray>
// 	| ForPropsWithDisplay<TArray>;

// export default function For<TArray extends unknown[]>(props: ForProps<TArray>) {
// 	if (props.array.length === 0) return props.fallback;
// 	if (props.display && props.getKey) {
// 		return props.array.map((item) => (
// 			<React.Fragment key={props.getKey(item)}>{props.display(item)}</React.Fragment>
// 		));
// 	}

// 	return props.array.map((item, index) => props.children(item, index));
// }
