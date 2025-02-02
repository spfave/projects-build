import { Outlet } from "react-router";

export default function RootLayout() {
	return (
		<>
			<p>Root Layout</p>
			<Outlet />
		</>
	);
}
