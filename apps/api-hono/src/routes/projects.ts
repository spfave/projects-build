import { validator } from "hono/validator";

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

api.get(
	"/:id",
	validator("param", (params, ctx) => {
		const { id } = params;
		if (!id || id.length !== 8)
			return ctx.json(
				{ message: HttpStatus.UNPROCESSABLE_ENTITY.phrase },
				HttpStatus.UNPROCESSABLE_ENTITY.code
			);

		return { id };
	}),
	async (ctx) => {
		const { id } = ctx.req.valid("param");

		// const project = await selectProjectByIdQuery(id);
		const [project] = await selectProjectByIdSelect(id);

		if (!project)
			return ctx.json(
				{ message: HttpStatus.NOT_FOUND.phrase },
				HttpStatus.NOT_FOUND.code
			);

		return ctx.json(project, HttpStatus.OK.code);
	}
);

api.post("/", async (ctx) => {
	const payload = (await ctx.req.json()) as ProjectInsert;
	const [result] = await insertProject(payload);
	return ctx.json(result, HttpStatus.CREATED.code);
});

api.patch("/:id", async (ctx) => {
	const { id } = ctx.req.param();
	const payload = (await ctx.req.json()) as ProjectUpdate;
	const [project] = await updateProject(id, payload);

	if (!project)
		return ctx.json({ message: HttpStatus.NOT_FOUND.phrase }, HttpStatus.NOT_FOUND.code);

	return ctx.json(project, HttpStatus.OK.code);
});

api.delete("/:id", async (ctx) => {
	const { id } = ctx.req.param();
	// const result = await deleteProject(id);
	// return result.rowsAffected > 0
	// 	? ctx.json({ rowsDeleted: result.rowsAffected }, HttpStatus.OK.code)
	// 	: ctx.body(null, HttpStatus.NO_CONTENT.code);

	// const [project] = await deleteProjectReturning(id);
	// return project
	// 	? ctx.json(project, HttpStatus.OK.code)
	// 	: ctx.json(undefined, HttpStatus.NO_CONTENT.code);
	// Note: If returning status 204 - "No Content" json content must be "undefined"
	// returning ctx.json(val | obj | null, 204) errors

	const [project] = await deleteProjectReturning(id);

	if (!project)
		return ctx.json({ message: HttpStatus.NOT_FOUND.phrase }, HttpStatus.NOT_FOUND.code);

	return ctx.json(project, HttpStatus.OK.code);
});

export default api;
// export { api };
