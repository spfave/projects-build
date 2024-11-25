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
import { HttpStatus } from "@projectsbuild/library/constants";
import { createRouter } from "../app.ts";

const api = createRouter().basePath("/v1/projects");

api.get("/", async (ctx) => {
	const projects = await selectProjectsQuery();
	// const projects = await selectProjectsSelect();
	return ctx.json(projects, HttpStatus.OK.code);
});

api.get("/:id", async (ctx) => {
	const { id } = ctx.req.param();
	// const project = await selectProjectByIdQuery(id);
	const [project] = await selectProjectByIdSelect(id);
	return ctx.json(project, HttpStatus.OK.code);
});

api.post("/", async (ctx) => {
	const payload = (await ctx.req.json()) as ProjectInsert;
	const [result] = await insertProject(payload);
	return ctx.json(result, HttpStatus.CREATED.code);
});

api.patch("/:id", async (ctx) => {
	const { id } = ctx.req.param();
	const payload = (await ctx.req.json()) as ProjectUpdate;
	const [result] = await updateProject(id, payload);
	return ctx.json(result, HttpStatus.OK.code);
});

api.delete("/:id", async (ctx) => {
	const { id } = ctx.req.param();
	// const result = await deleteProject(id);
	// return result.rowsAffected > 0
	// 	? ctx.json({ rowsDeleted: result.rowsAffected }, HttpStatus.OK.code)
	// 	: ctx.body(null, HttpStatus.NO_CONTENT.code);

	const [result] = await deleteProjectReturning(id);
	return result
		? ctx.json(result, HttpStatus.OK.code)
		: ctx.json(undefined, HttpStatus.NO_CONTENT.code);
	// Note: If returning status 204 - "No Content" json content must be "undefined"
	// returning ctx.json(val | obj | null, 204) errors
});

export default api;
// export { api };
