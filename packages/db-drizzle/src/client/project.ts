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
	return await db.select().from(projects).where(eq(projects.id, projectId));
}

export async function insertProject(project: ProjectInsert) {
	return await db.insert(projects).values(project).returning();
}

// export async function updateProject(project: ProjectUpdate) {}
export async function updateProject(projectId: ProjectId, project: ProjectUpdate) {
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
	return await db.delete(projects).where(eq(projects.id, projectId)).returning();
}
