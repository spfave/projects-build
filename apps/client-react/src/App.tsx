import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <div>Error</div>,
		children: [
			{ index: true, element: <div>RootIndex</div> },
			{ path: "/projects/create", element: <div>Project create</div> },
			{ path: "/projects/:id", element: <div>Project Id</div> },
			{ path: "/about", element: <div>About</div> },
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
