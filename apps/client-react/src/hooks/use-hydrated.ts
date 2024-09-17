import * as React from "react";

/**
 * Hook provides hydration state.
 * @returns Object containing client hydration state and client isHydrated boolean
 */
export function useHydrated() {
	const [state, setState] = React.useState<"not-hydrated" | "hydrated">("not-hydrated");
	React.useEffect(() => setState("hydrated"), []);

	return { state, isHydrated: state === "hydrated" } as const;
}
