import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import ProjectsRoute from "~/views/projects-route";
import Root from "~/views/root";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <div>Error</div>,
		children: [
			{ index: true, element: <Navigate to="/projects" /> },
			{
				path: "/projects",
				element: <ProjectsRoute />,
				children: [
					{ path: "create", element: <div>Project create</div> },
					{ path: ":id", element: <div>Project Id</div> },
					{ path: ":id/edit", element: <div>Project Id Edit</div> },
				],
			},
			{ path: "/about", element: <div>About</div> },
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
