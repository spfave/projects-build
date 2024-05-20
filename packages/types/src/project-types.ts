import type { DateString } from "./util-types";

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
	| { status: "complete"; dateCompleted: DateString; rating: number; recommend: boolean };

export type ProjectStatus = ProjectTypeBase["status"];
export type Project = ProjectBase & ProjectTypeBase;
export type ProjectInput = Omit<Project, "id">;
