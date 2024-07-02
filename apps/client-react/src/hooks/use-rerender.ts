import * as React from "react";

/**
 * Hook to rerender.
 * @returns function to force rerender
 */
export function useRerender() {
	const [, setState] = React.useState({});
	const rerender = React.useCallback(() => setState({}), []);

	return rerender;
}
