import type {
	FormElement,
	FormErrors,
	FormErrorsAttributes,
	FormFields,
	Pretty,
} from "@projectsbuild/library/types";

export type ProjectId = string;
type ProjectBase = {
	id: ProjectId;
	name: string;
	link?: string;
	description?: string;
	notes?: string;
};

type ProjectTypeBase =
	| { status: "planning" }
	| { status: "building" }
	| { status: "complete"; dateCompleted: string; rating: number; recommend: boolean };

export type Project = Pretty<ProjectBase & ProjectTypeBase>;
export type ProjectInput = Omit<ProjectBase, "id"> & ProjectTypeBase;
export type ProjectStatus = ProjectTypeBase["status"];

export type ProjectFormElement = FormElement<
	Extract<Project, { status: "complete" }>,
	{
		id: HTMLInputElement;
		name: HTMLInputElement;
		link: HTMLInputElement;
		description: HTMLTextAreaElement;
		notes: HTMLTextAreaElement;
		status: HTMLSelectElement;
		dateCompleted: HTMLInputElement;
		rating: HTMLInputElement;
		recommend: HTMLInputElement;
	}
>;
export type ProjectFields = {
	[P in Project as P["status"]]: FormFields<P>;
}[ProjectStatus];
export type ProjectErrors = FormErrors<Extract<ProjectFields, { status: "complete" }>>;
export type ProjectErrorsAttrs = FormErrorsAttributes<
	Extract<ProjectFields, { status: "complete" }>
>;
