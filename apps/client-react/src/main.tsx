import * as React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

import "~/styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
