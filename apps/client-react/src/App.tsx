import * as React from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import ErrorBoundary from "~/components/error-boundary";
import GeneralErrorFallback from "~/components/general-error-fallback";
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
						<ErrorBoundary FallbackComponent={GeneralErrorFallback}>
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
		future: {
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_partialHydration: true,
			v7_relativeSplatPath: true,
		},
	}
);

export default function App() {
	return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
