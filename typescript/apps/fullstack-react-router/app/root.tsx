import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";

export const links: Route.LinksFunction = () => [
	{
		rel: "icon",
		type: "image/svg+xml",
		href: "./reshot-icon-project-management.svg",
	},
	{ rel: "stylesheet", href: stylesheet },
];

export const meta: Route.MetaFunction = (args) => [
	{ title: "Projects.build | Fullstack React Router" },
	{ name: "description", content: "Welcome to Projects.build" },
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="flex flex-col">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function HydrateFallback() {
	return <div>Root Loading...</div>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	console.warn(`\nERROR BOUNDARY: ROOT`); //LOG
	console.info(`error: `, error); //LOG
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		console.info(`IF: is route error res`); //LOG
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		console.info(`ELSE IF: not route error res`); //LOG
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full overflow-x-auto p-4">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
