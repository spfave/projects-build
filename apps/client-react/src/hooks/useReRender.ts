import * as React from "react";

export function useReRender() {
	const [, setState] = React.useState({});

	return () => setState({});
}
