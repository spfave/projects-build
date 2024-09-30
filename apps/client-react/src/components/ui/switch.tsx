import type * as React from "react";

import type { AsyncStatus } from "~/hooks/use-async";

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

// Ref:
// https://github.com/romac/react-if/tree/master
// https://docs.solidjs.com/reference/components/switch-and-match
export default function Switch<TState extends string>(props: SwitchProps<TState>) {
	const { state, display, fallback } = props;

	if (state in display) return display[state];
	return fallback;
}

export function SwitchAsync(props: SwitchProps<AsyncStatus>) {
	return <Switch {...props} />;
}
