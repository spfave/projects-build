import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	layout("layouts/root-layout.tsx", [
		index("routes/index.tsx"),

		...prefix("projects", [
			layout("features/projects/routes/projects-layout.tsx", [
				index("features/projects/routes/projects-index.tsx"),
				route("create", "features/projects/routes/project-create.tsx"),
				route(":id", "features/projects/routes/project.tsx"),
				route(":id/edit", "features/projects/routes/project-edit.tsx"),
			]),
		]),

		route("about", "routes/about.tsx"),
	]),
] satisfies RouteConfig;
