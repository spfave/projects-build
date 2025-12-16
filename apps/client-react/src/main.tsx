import * as React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

import "~/styles/index.css";

// ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
// 	<React.StrictMode>
// 		<App />
// 	</React.StrictMode>
// );

// Ref: https://react.dev/reference/react-dom/client/createRoot#error-logging-in-production
const container = document.getElementById("root") as HTMLDivElement;
const root = ReactDOM.createRoot(container, {
	onCaughtError: (error, info) => console.error("Caught error:", error, info),
	onUncaughtError: (error, info) => console.error("Uncaught error:", error, info),
});
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
