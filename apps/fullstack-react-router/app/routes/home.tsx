import type { Route } from "./+types/home";

export function meta(args: Route.MetaArgs) {
	return [
		{ title: "Projects.build | Fullstack React Router" },
		{ name: "description", content: "Welcome to Projects.build" },
	];
}

export default function Home() {
	return <p>Projects.build - Fullstack React Router</p>;
}
