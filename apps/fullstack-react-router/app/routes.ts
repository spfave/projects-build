import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	layout("layouts/root-layout.tsx", [
		index("routes/index.tsx"),

		...prefix("projects", [
			layout("routes/projects-layout.tsx", [
				index("routes/projects-index.tsx"),
				route("create", "routes/project-create.tsx"),
				route(":id", "routes/project.tsx"),
				route(":id/edit", "routes/project-edit.tsx"),
			]),
		]),

		route("about", "routes/about.tsx"),
	]),
] satisfies RouteConfig;
