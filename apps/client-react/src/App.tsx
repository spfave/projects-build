import * as React from "react";
import { Navigate, createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import GeneralErrorFallback from "~/components/error-fallback";
import ErrorBoundary from "~/components/ui/error-boundary";
import ProjectCreateRoute from "~/views/project-create-route";
import ProjectEditRoute from "~/views/project-edit-route";
import ProjectRoute from "~/views/project-route";
import ProjectsRoute from "~/views/projects-route";
import Root from "~/views/root";

const About = React.lazy(() => import("~/views/about-route"));

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <Root />,
			// errorElement: <div>An Error Occurred</div>,
			children: [
				{ index: true, element: <Navigate to="projects" /> },
				{
					path: "projects",
					element: (
						<ErrorBoundary fallback={(error) => <GeneralErrorFallback error={error} />}>
							<ProjectsRoute />
						</ErrorBoundary>
					),
					children: [
						{
							index: true,
							element: <p>Create or select a project to get started</p>,
						},
						{ path: "create", element: <ProjectCreateRoute /> },
						{ path: ":id", element: <ProjectRoute /> },
						{ path: ":id/edit", element: <ProjectEditRoute /> },
					],
				},
				{
					path: "about",
					element: (
						<React.Suspense fallback={<p>Loading...</p>}>
							<About />
						</React.Suspense>
					),
				},
				{
					path: "*",
					element: <div>Page Not Found</div>,
				},
			],
		},
	],
	{
		future: {},
	}
);

export default function App() {
	return <RouterProvider router={router} />;
}
