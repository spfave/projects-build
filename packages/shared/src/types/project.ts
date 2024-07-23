import type { FormErrors, FormFields } from "@projectsbuild/library/types";

type ProjectBase = {
	id: string;
	name: string;
	link?: string;
	description?: string;
	notes?: string;
};

type ProjectTypeBase =
	| { status: "planning" }
	| { status: "building" }
	| { status: "complete"; dateCompleted: string; rating: number; recommend: boolean };

export type Project = ProjectBase & ProjectTypeBase;
export type ProjectInput = Omit<ProjectBase, "id"> & ProjectTypeBase;
export type ProjectStatus = ProjectTypeBase["status"];

export type ProjectFields = {
	[P in Project as P["status"]]: FormFields<P>;
}[ProjectStatus];
export type ProjectErrors = FormErrors<Extract<ProjectFields, { status: "complete" }>>;
