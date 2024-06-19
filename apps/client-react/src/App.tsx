import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import About from "~/views/about-route";
import ProjectCreateRoute from "~/views/project-create-route";
import ProjectEditRoute from "~/views/project-edit-route";
import ProjectRoute from "~/views/project-route";
import ProjectsRoute from "~/views/projects-route";
import Root from "~/views/root";

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
					element: <ProjectsRoute />,
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
				{ path: "about", element: <About /> },
			],
		},
	],
	{
		future: {
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_relativeSplatPath: true,
			v7_partialHydration: true,
		},
	}
);

export default function App() {
	return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
