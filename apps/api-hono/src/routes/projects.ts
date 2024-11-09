import { Hono } from "hono";

import {
	selectProjectsQuery,
	selectProjectsSelect,
} from "@projectsbuild/db-drizzle/data-services";

const api = new Hono().basePath("/v1/projects");

api.get("/", async (ctx) => {
	const projects = await selectProjectsQuery();
	// const projects = await selectProjectsSelect();
	return ctx.json({ projects }, 200);
});

api.get("/:id", (ctx) => {
	return ctx.json({ message: `get project with id: ${ctx.req.param("id")}` });
});

api.post("/", (ctx) => {
	return ctx.json({ message: "create project" });
});

api.patch("/:id", (ctx) => {
	return ctx.json({ message: `update project with id: ${ctx.req.param("id")}` });
});

api.delete("/:id", (ctx) => {
	return ctx.json({ message: `delete project with id: ${ctx.req.param("id")}` });
});

export default api;
// export { api };
