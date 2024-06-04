import * as React from "react";

export function useRerender() {
	const [, setState] = React.useState({});
	const rerender = React.useCallback(() => setState({}), []);

	return rerender;
}
