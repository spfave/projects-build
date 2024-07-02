import * as React from "react";

/**
 * Hook to get hydration state
 * @returns boolean indicating if client is hydrated
 */
export function useIsHydrated() {
	const [isHydrated, setIsHydrated] = React.useState(false);
	React.useEffect(() => setIsHydrated(true), []);
	return isHydrated;
}
