import * as React from "react";
import { createBrowserRouter, Navigate, useRouteError } from "react-router";
import { RouterProvider } from "react-router/dom";

import GeneralErrorFallback from "~/components/error-fallback";
import ErrorBoundary from "~/components/ui/error-boundary";
import ProjectCreatePage from "~/views/project-create-page";
import ProjectEditPage from "~/views/project-edit-page";
import ProjectPage, { ProjectErrorBoundary } from "~/views/project-page";
import ProjectsLayout from "~/views/projects-layout";
import Root from "~/views/root";

const AboutPage = React.lazy(() => import("~/views/about-page"));

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <Root />,
			errorElement: <div>An Error Occurred</div>,
			children: [
				{ index: true, element: <Navigate to="projects" /> },
				{
					path: "projects",
					element: (
						<ErrorBoundary fallback={(error) => <GeneralErrorFallback error={error} />}>
							<ProjectsLayout />
						</ErrorBoundary>
					),
					children: [
						{
							index: true,
							element: <p>Create or select a project to get started</p>,
						},
						{
							path: "create",
							element: <ProjectCreatePage />,
							ErrorBoundary: () => <GeneralErrorFallback error={useRouteError()} />,
						},
						{
							path: ":id",
							element: <ProjectPage />,
							ErrorBoundary: ProjectErrorBoundary, // note: will catch render and in-transition thrown errors, but not async thrown errors outside a transition
						},
						{
							path: ":id/edit",
							element: <ProjectEditPage />,
							ErrorBoundary: ProjectErrorBoundary,
						},
					],
				},
				{
					path: "about",
					element: (
						<React.Suspense fallback={<p>Loading...</p>}>
							<AboutPage />
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
	return (
		<RouterProvider
			router={router}
			onError={(error, { errorInfo: info }) => {
				console.error("Router error:", error, info);
			}}
		/>
	);
}
