import { eq } from "drizzle-orm";

import { db } from "#db/db.ts";
import {
	type ProjectInsert,
	type ProjectSelect,
	type ProjectUpdate,
	projects,
} from "#db/schema.ts";

type ProjectId = ProjectSelect["id"];

export async function selectProjectsQuery() {
	// throw new Error("error - db select projects query", { cause: "db error demo" });
	return await db.query.projects.findMany({ columns: { id: true, name: true } });
}
export async function selectProjectsSelect() {
	return await db.select({ id: projects.id, name: projects.name }).from(projects);
}

export async function selectProjectByIdQuery(projectId: ProjectId) {
	return await db.query.projects.findFirst({
		columns: {
			createdAt: false,
			updatedAt: false,
		},
		where: eq(projects.id, projectId),
		// where: (proj, { eq }) => eq(proj.id, projectId),
	});
}
export async function selectProjectByIdSelect(projectId: ProjectId) {
	// throw new Error("error - db select project by id select");
	return await db.select().from(projects).where(eq(projects.id, projectId));
}

export async function insertProject(project: ProjectInsert) {
	// throw new Error("error - db insert project");
	return await db
		.insert(projects)
		.values(project)
		.returning()
		.catch((err) => {
			// note: catches db constraint errors
			console.info(`error: DB insert project: `, err);
			throw err;
		});
}

// export async function updateProject(project: ProjectUpdate) {}
export async function updateProject(projectId: ProjectId, project: ProjectUpdate) {
	// export async function updateProject(projectId: ProjectId, project: ProjectInsert) {
	// if (project.status !== "complete") {
	// 	// Set "complete" status fields to null to overwrite existing data if updating from
	// 	// "complete" to "planning/building" status
	// 	project.dateCompleted = null;
	// 	project.rating = null;
	// 	project.recommend = null;
	// }
	// throw new Error("error - db update project");
	return await db
		.update(projects)
		.set(project)
		.where(eq(projects.id, projectId))
		.returning();
}

export async function deleteProject(projectId: ProjectId) {
	return await db.delete(projects).where(eq(projects.id, projectId));
}
export async function deleteProjectReturning(projectId: ProjectId) {
	// throw new Error("error - db delete project returning");
	return await db.delete(projects).where(eq(projects.id, projectId)).returning();
}
