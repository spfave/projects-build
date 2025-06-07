import { hc } from "hono/client";
import { validator } from "hono/validator";

import { defaultRouter } from "#lib/core-app.ts";
import * as db from "@projectsbuild/db-drizzle/repositories/projects.ts";
import { HttpStatus } from "@projectsbuild/library/constants";
import { jSend } from "@projectsbuild/library/utils";
import {
	transformProject,
	validateProject,
	validateProjectId,
} from "@projectsbuild/shared/projects";

// Validators
const validateParamProjectId = validator("param", (params, ctx) => {
	const { id } = params;
	if (!validateProjectId(id).success)
		return ctx.json(
			jSend({ status: "fail", message: "invalid project id" }),
			HttpStatus.UNPROCESSABLE_ENTITY.code
		);

	return { id: String(id) }; // validation ensures id is string with value
	// return { id } as { id: string };
});

const validateJsonProject = validator("json", async (_json, ctx) => {
	const json = await ctx.req.json(); // _json function parameter value not coming through with fetch
	// console.info(`_json: `, _json); //LOG
	// console.info(`json: `, json); //LOG
	const validation = validateProject(json);
	if (validation.status === "error")
		return ctx.json(
			jSend({
				status: "fail",
				message: "invalid project",
				data: { errors: validation.errors },
			}),
			HttpStatus.UNPROCESSABLE_ENTITY.code
		);

	const validProject = transformProject(json);
	return validProject;
});

// API endpoints
export type ApiProject = typeof apiProjects;
export const apiProjects = defaultRouter()
	.basePath("/v1/projects")

	// Note: Chain route handlers to capture types for RPC client
	// Alternate option: import app and add routes directly
	// export const apiProjects = app.basePath("/v1/projects")
	// 	.get("/", (ctx) => {
	//	 	const projects = selectProjects();
	//	 	return ctx.json(projects, 200);
	//	 });

	.get("/", async (ctx) => {
		const projects = await db.selectProjectsQuery();
		// const projects = await db.selectProjectsSelect();
		return ctx.json(projects, HttpStatus.OK.code);
		// return ctx.json(jSend({ status: "success", data: { projects } }), HttpStatus.OK.code);
	})

	.get("/:id", validateParamProjectId, async (ctx) => {
		const { id } = ctx.req.valid("param");

		// const project = await db.selectProjectByIdQuery(id);
		const [project] = await db.selectProjectByIdSelect(id);

		if (!project)
			return ctx.json(
				{ message: HttpStatus.NOT_FOUND.phrase },
				HttpStatus.NOT_FOUND.code
			);
		// return ctx.json(
		// 	jSend({ status: "fail", message: "project not found" }),
		// 	HttpStatus.NOT_FOUND.code
		// );

		return ctx.json(project, HttpStatus.OK.code);
		// return ctx.json(jSend({ status: "success", data: { project } }), HttpStatus.OK.code);
	})

	.post("/", validateJsonProject, async (ctx) => {
		const payload = ctx.req.valid("json");
		const [project] = await db.insertProject(payload);

		// Note: Included for return type inference, validator should ensure this doesn't occur
		if (!project)
			return ctx.json(
				{ message: HttpStatus.INTERNAL_SERVER_ERROR.phrase },
				HttpStatus.INTERNAL_SERVER_ERROR.code
			);

		return ctx.json(project, HttpStatus.CREATED.code);
	})

	.put("/:id", validateParamProjectId, validateJsonProject, async (ctx) => {
		const { id } = ctx.req.valid("param");
		const payload = ctx.req.valid("json");
		const [project] = await db.updateProject(id, payload);

		if (!project)
			return ctx.json(
				{ message: HttpStatus.NOT_FOUND.phrase },
				HttpStatus.NOT_FOUND.code
			);

		return ctx.json(project, HttpStatus.OK.code);
	})

	.delete("/:id", validateParamProjectId, async (ctx) => {
		const { id } = ctx.req.valid("param");
		const [project] = await db.deleteProjectReturning(id);

		if (!project)
			return ctx.json(
				{ message: HttpStatus.NOT_FOUND.phrase },
				HttpStatus.NOT_FOUND.code
			);

		return ctx.json(project, HttpStatus.OK.code);
	});

// Compiled RPC client with types
type ClientProjects = ReturnType<typeof hc<ApiProject>>;
export function hcApiProjectsTyped(...args: Parameters<typeof hc>): ClientProjects {
	return hc<ApiProject>(...args);
}
