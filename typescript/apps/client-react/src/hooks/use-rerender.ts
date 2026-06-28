import * as React from "react";

/**
 * Hook enables rerendering.
 * @returns Function to force rerender
 */
export function useRerender() {
	const [, rerender] = React.useReducer(() => ({}), {});
	return rerender;
}
