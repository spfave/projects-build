import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import ProjectsRoute from "~/views/projects-route";
import Root from "~/views/root";

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <Root />,
			errorElement: <div>Error</div>,
			children: [
				{ index: true, element: <Navigate to="projects" /> },
				{
					path: "projects",
					element: <ProjectsRoute />,
					children: [
						{ path: "create", element: <div>Project Create</div> },
						{ path: ":id", element: <div>Project Id</div> },
						{ path: ":id/edit", element: <div>Project Id Edit</div> },
					],
				},
				{ path: "about", element: <div>About</div> },
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
