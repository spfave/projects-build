import { validator } from "hono/validator";

import { transformProject, validateProject } from "@projectsbuild/core/projects";
import * as db from "@projectsbuild/db-drizzle/repositories/projects.ts";
import { UUID_DEFAULT_LENGTH } from "@projectsbuild/db-drizzle/schema-type";
import { HttpStatus } from "@projectsbuild/library/constants";
import { defaultRouter } from "#lib/init.ts";

const api = defaultRouter().basePath("/v1/projects");

const validateParamProjectId = validator("param", (params, ctx) => {
	const { id } = params;
	if (!id || typeof id !== "string" || id.length !== UUID_DEFAULT_LENGTH)
		return ctx.json(
			{ message: HttpStatus.UNPROCESSABLE_ENTITY.phrase },
			HttpStatus.UNPROCESSABLE_ENTITY.code
		);

	return { id };
});

const validateJsonProject = validator("json", (json, ctx) => {
	const validation = validateProject(json);
	if (!validation.success)
		return ctx.json(
			{
				success: false,
				message: HttpStatus.UNPROCESSABLE_ENTITY.phrase,
				errors: validation.errors,
			},
			HttpStatus.UNPROCESSABLE_ENTITY.code
		);

	const validProject = transformProject(json);
	return validProject;
});

// Note: Types are not captured with individual route handlers for RPC client
api.get("/", async (ctx) => {
	const projects = await db.selectProjectsQuery();
	// const projects = await db.selectProjectsSelect();
	return ctx.json(projects, HttpStatus.OK.code);
});

api.get("/:id", validateParamProjectId, async (ctx) => {
	const { id } = ctx.req.valid("param");

	// const project = await db.selectProjectByIdQuery(id);
	const project = await db.selectProjectByIdSelect(id);

	if (!project)
		return ctx.json({ message: HttpStatus.NOT_FOUND.phrase }, HttpStatus.NOT_FOUND.code);

	return ctx.json(project, HttpStatus.OK.code);
});

// api.post("/", async (ctx) => {
// 	const payload = await ctx.req.json();
// 	const [project] = await db.insertProject(payload);
// 	return ctx.json(project, HttpStatus.CREATED.code);
// });
api.post("/", validateJsonProject, async (ctx) => {
	const payload = ctx.req.valid("json");
	const [project] = await db.insertProject(payload);
	return ctx.json(project, HttpStatus.CREATED.code);
});

api.patch("/:id", validateParamProjectId, validateJsonProject, async (ctx) => {
	const { id } = ctx.req.valid("param");
	const payload = ctx.req.valid("json");
	const [project] = await db.updateProject(id, payload);

	if (!project)
		return ctx.json({ message: HttpStatus.NOT_FOUND.phrase }, HttpStatus.NOT_FOUND.code);

	return ctx.json(project, HttpStatus.OK.code);
});

api.delete("/:id", validateParamProjectId, async (ctx) => {
	// const { id } = ctx.req.param();
	// const result = await db.deleteProject(id);
	// return result.rowsAffected > 0
	// 	? ctx.json({ rowsDeleted: result.rowsAffected }, HttpStatus.OK.code)
	// 	: ctx.body(null, HttpStatus.NO_CONTENT.code);

	// const [project] = await db.deleteProjectReturning(id);
	// return project
	// 	? ctx.json(project, HttpStatus.OK.code)
	// 	: ctx.json(undefined, HttpStatus.NO_CONTENT.code);
	// Note: If returning status 204 - "No Content" json content must be "undefined"
	// returning 'ctx.json(val | obj | null, 204)' errors

	const { id } = ctx.req.valid("param");
	const [project] = await db.deleteProjectReturning(id);

	if (!project)
		return ctx.json({ message: HttpStatus.NOT_FOUND.phrase }, HttpStatus.NOT_FOUND.code);

	return ctx.json(project, HttpStatus.OK.code);
});

export default api;
// export { api };
