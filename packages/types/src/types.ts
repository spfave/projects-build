type ProjectBase = {
	id: number;
	name: string;
	link?: string;
	description?: string;
	notes?: string;
};

type ProjectTypeBase =
	| { status: "planning" }
	| { status: "building" }
	| { status: "complete"; recommend: boolean; rating: number; dateCompleted: Date };

export type Project = ProjectBase & ProjectTypeBase;

export type ProjectStatus = Project["status"];
