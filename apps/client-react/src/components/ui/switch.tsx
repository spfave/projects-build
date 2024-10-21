import type * as React from "react";

import type { AsyncStatus } from "~/hooks/use-async";

// Ref: Switch Component
// https://github.com/romac/react-if/tree/master
// https://docs.solidjs.com/reference/components/switch-and-match
type SwitchBaseProps = {
	fallback?: React.ReactNode;
};
// type SwitchPropsWithChildren = SwitchBaseProps & {
// 	children: React.ReactNode;
// 	state?: never;
// 	display?: never;
// };
type SwitchPropsWithDisplay<TState extends string> = SwitchBaseProps & {
	// children?: never;
	state: TState;
	display: Record<TState, React.ReactNode>;
};
type SwitchProps<TState extends string> =
	// | SwitchPropsWithChildren
	SwitchPropsWithDisplay<TState>;

export default function Switch<TState extends string>(props: SwitchProps<TState>) {
	const { state, display, fallback } = props;

	if (!(state in display)) return fallback;
	return display[state];
}

export function SwitchAsync(props: SwitchProps<AsyncStatus>) {
	return <Switch {...props} />;
}
