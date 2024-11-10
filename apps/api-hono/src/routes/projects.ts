import { Hono } from "hono";

import {
	deleteProject,
	deleteProjectReturning,
	insertProject,
	selectProjectByIdQuery,
	selectProjectByIdSelect,
	selectProjectsQuery,
	selectProjectsSelect,
	updateProject,
} from "@projectsbuild/db-drizzle/data-services";
import type { ProjectInsert, ProjectUpdate } from "@projectsbuild/db-drizzle/schema";

const api = new Hono().basePath("/v1/projects");

api.get("/", async (ctx) => {
	const projects = await selectProjectsQuery();
	// const projects = await selectProjectsSelect();
	return ctx.json(projects, 200);
});

api.get("/:id", async (ctx) => {
	const { id } = ctx.req.param();
	// const project = await selectProjectByIdQuery(id);
	const [project] = await selectProjectByIdSelect(id);
	return ctx.json(project, 200);
});

api.post("/", async (ctx) => {
	const payload = (await ctx.req.json()) as ProjectInsert;
	const [result] = await insertProject(payload);
	return ctx.json(result, 201);
});

api.patch("/:id", async (ctx) => {
	const { id } = ctx.req.param();
	const payload = (await ctx.req.json()) as ProjectUpdate;
	const [result] = await updateProject(id, payload);
	return ctx.json(result, 200);
});

api.delete("/:id", async (ctx) => {
	const { id } = ctx.req.param();
	// const result = await deleteProject(id);
	// return result.rowsAffected > 0
	// 	? ctx.json({ rowsDeleted: result.rowsAffected }, 200)
	// 	: ctx.body(null, 204);

	const [result] = await deleteProjectReturning(id);
	return result ? ctx.json(result, 200) : ctx.json(undefined, 204);
	// Note: If returning status 204 - "No Content" json content must be "undefined"
	// returning ctx.json(val | obj | null, 204) errors
});

export default api;
// export { api };
