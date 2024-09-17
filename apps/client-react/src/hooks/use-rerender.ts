import * as React from "react";

/**
 * Hook enables rerendering.
 * @returns Function to force rerender
 */
export function useRerender() {
	const [, setState] = React.useState({});
	const rerender = React.useCallback(() => setState({}), []);

	return rerender;
}
