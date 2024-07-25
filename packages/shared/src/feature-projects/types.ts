import type {
	FormElement,
	FormErrors,
	FormErrorsAttributes,
	FormFields,
} from "@projectsbuild/library/types";

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
export type ProjectErrors = FormErrors<Extract<ProjectFields, { status: "complete" }>>;
export type ProjectErrorsAttrs = FormErrorsAttributes<
	Extract<ProjectFields, { status: "complete" }>
>;
