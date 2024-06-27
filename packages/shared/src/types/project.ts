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

export type ProjectStatus = ProjectTypeBase["status"];
export type Project = ProjectBase & ProjectTypeBase;
export type ProjectInput = Omit<ProjectBase, "id"> & ProjectTypeBase;

// Form type representation of Project type: convert non-string fields to string
// Ref: https://www.totaltypescript.com/concepts/mapped-type, https://www.totaltypescript.com/immediately-indexed-mapped-type
export type ProjectForm = {
	[P in Project as P["status"]]: {
		[Key in keyof P]: P[Key] extends string ? P[Key] : string;
	};
}[ProjectStatus];
