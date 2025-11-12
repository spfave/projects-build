import type * as React from "react";

import type { AsyncStatus } from "~/hooks/use-async";

// Ref: Switch Component
// https://github.com/romac/react-if/tree/master
// https://docs.solidjs.com/reference/components/switch-and-match
interface SwitchBaseProps {
	fallback?: React.ReactNode;
}
// interface SwitchPropsWithChildren extends SwitchBaseProps {
// 	children: React.ReactNode;
// 	state?: never;
// 	display?: never;
// };
interface SwitchPropsWithDisplay<TState extends string> extends SwitchBaseProps {
	// children?: never;
	state: TState;
	display: Record<TState, React.ReactNode>;
}
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
