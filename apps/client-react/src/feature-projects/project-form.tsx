import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { formErrorsAttributes, ymdToday } from "@projectsbuild/library/utils";
import { transformProject, validateProject } from "@projectsbuild/shared/projects";
import type {
	Project,
	ProjectErrors,
	ProjectFields,
	ProjectStatus,
} from "@projectsbuild/shared/projects";
import ErrorList from "~/components/error-list";
import { useFocusInvalid } from "~/hooks/use-focus-invalid";
import { useHydrated } from "~/hooks/use-hydrated";
import { useProjectsContext } from "~/views/projects-route";

import styles from "./project-form.module.css";

type ProjectFormBaseProps = {
	action: (project: Project) => Promise<Project>;
	// handleSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
	// handleReset?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	cancelRedirectUrl: string;
};
type ProjectFormTypeBaseProps = { mode: "create" } | { mode: "edit"; project: Project };
type ProjectFormProps = ProjectFormBaseProps & ProjectFormTypeBaseProps;
// type ProjectFormProps = React.PropsWithChildren<ProjectFormBaseProps & ProjectFormTypeBaseProps>;
// const ProjectFormDefaultProps: Partial<ProjectFormProps> = { mode: "create" };
export default function ProjectForm(props: ProjectFormProps) {
	const { mode, action, cancelRedirectUrl } = props;

	const navigate = useNavigate();
	const { fetchProjects } = useProjectsContext();

	const refForm = React.useRef<HTMLFormElement>(null);
	const [projectStatus, setProjectStatus] = React.useState<ProjectStatus | undefined>(
		mode === "edit" ? props.project.status : undefined
	);
	const [projectErrors, setProjectErrors] = React.useState<ProjectErrors | null>(null);

	function handleSelectProjectStatus(evt: React.ChangeEvent<HTMLSelectElement>) {
		setProjectStatus(evt.target.value as ProjectStatus);
	}

	async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const formData = new FormData(evt.currentTarget);
		const formObj = Object.fromEntries(formData.entries());
		const validation = validateProject(formObj);
		if (validation.status === "error") return setProjectErrors(validation.errors);
		if (projectErrors) setProjectErrors(null);

		const projectPayload = transformProject(formObj as ProjectFields);
		const project = await action(projectPayload);

		fetchProjects();
		navigate(`/projects/${project.id}`);
	}

	const { isHydrated } = useHydrated();
	const { form: errForm, fields: errFields } = projectErrors || {};
	const { form: errAttrForm, fields: errAttrFields } =
		formErrorsAttributes(projectErrors) || {};
	useFocusInvalid(refForm.current, Boolean(projectErrors));

	return (
		<form
			className={styles.projectForm}
			ref={refForm}
			onSubmit={handleSubmit}
			noValidate={isHydrated}
			aria-invalid={errAttrForm?.hasErrors}
			aria-describedby={errAttrForm?.id}
			tabIndex={-1}
		>
			{mode === "edit" && (
				<div>
					<input id="id" hidden type="text" name="id" defaultValue={props.project.id} />
				</div>
			)}

			<div className={styles.formFlexGroup}>
				<div>
					<label htmlFor="name">Name</label>
					<input
						id="name"
						type="text"
						name="name"
						placeholder="project title"
						required
						minLength={2}
						defaultValue={mode === "edit" ? props.project.name : undefined}
						aria-invalid={errAttrFields?.name.hasErrors}
						aria-describedby={errAttrFields?.name.id}
					/>
					<div>
						<ErrorList id={errAttrFields?.name.id} errors={errFields?.name} />
					</div>
				</div>
				<div>
					<label htmlFor="link">Link</label>
					<input
						id="link"
						type="url"
						name="link"
						placeholder="image or site url"
						defaultValue={mode === "edit" ? props.project.link : undefined}
						aria-invalid={errAttrFields?.link.hasErrors}
						aria-describedby={errAttrFields?.link.id}
					/>
					<div>
						<ErrorList id={errAttrFields?.link.id} errors={errFields?.link} />
					</div>
				</div>
			</div>
			<div>
				<label htmlFor="description">Description</label>
				<textarea
					id="description"
					name="description"
					placeholder="add description..."
					defaultValue={mode === "edit" ? props.project.description : undefined}
					aria-invalid={errAttrFields?.description.hasErrors}
					aria-describedby={errAttrFields?.description.id}
				/>
				<div>
					<ErrorList id={errAttrFields?.description.id} errors={errFields?.description} />
				</div>
			</div>
			<div>
				<label htmlFor="notes">Notes</label>
				<textarea
					id="notes"
					name="notes"
					placeholder="add notes..."
					defaultValue={mode === "edit" ? props.project.notes : undefined}
					aria-invalid={errAttrFields?.notes.hasErrors}
					aria-describedby={errAttrFields?.notes.id}
				/>
				<div>
					<ErrorList id={errAttrFields?.notes.id} errors={errFields?.notes} />
				</div>
			</div>
			<div className={styles.formFlexGroup}>
				<div>
					<label htmlFor="status">Status</label>
					<select
						id="status"
						name="status"
						required
						value={projectStatus}
						onChange={handleSelectProjectStatus}
						aria-invalid={errAttrFields?.status.hasErrors}
						aria-describedby={errAttrFields?.status.id}
					>
						<option hidden value="">
							Select Status
						</option>
						<option value="planning">Planning</option>
						<option value="building">Building</option>
						<option value="complete">Complete</option>
					</select>
					<div>
						<ErrorList id={errAttrFields?.status.id} errors={errFields?.status} />
					</div>
				</div>
				{projectStatus === "complete" && (
					<div>
						<label htmlFor="dateCompleted">Date completed</label>
						<input
							id="dateCompleted"
							type="date"
							name="dateCompleted"
							required
							max={ymdToday()}
							defaultValue={
								mode === "edit" && props.project.status === "complete"
									? props.project.dateCompleted
									: undefined
							}
							aria-invalid={errAttrFields?.dateCompleted.hasErrors}
							aria-describedby={errAttrFields?.dateCompleted.id}
						/>
						<div>
							<ErrorList
								id={errAttrFields?.dateCompleted.id}
								errors={errFields?.dateCompleted}
							/>
						</div>
					</div>
				)}
			</div>

			{projectStatus === "complete" && (
				<div className={styles.formFlexGroup}>
					<div>
						<label htmlFor="rating">Rating</label>
						<input
							id="rating"
							type="number"
							name="rating"
							placeholder="value 1 through 5"
							required
							min={1}
							max={5}
							defaultValue={
								mode === "edit" && props.project.status === "complete"
									? props.project.rating
									: undefined
							}
							aria-invalid={errAttrFields?.rating.hasErrors}
							aria-describedby={errAttrFields?.rating.id}
						/>
						<div>
							<ErrorList id={errAttrFields?.rating.id} errors={errFields?.rating} />
						</div>
					</div>
					<div>
						<fieldset
							aria-invalid={errAttrFields?.rating.hasErrors}
							aria-describedby={errAttrFields?.rating.id}
						>
							<legend>Would you recommend</legend>
							<div>
								<span>
									<input
										id="recommend-yes"
										type="radio"
										name="recommend"
										required
										value="true"
										defaultChecked={
											mode === "edit" && props.project.status === "complete"
												? !props.project.recommend
												: undefined
										}
									/>
									<label htmlFor="recommend-yes">Yes</label>
								</span>
								<span>
									<input
										id="recommend-no"
										type="radio"
										name="recommend"
										required
										value="false"
										defaultChecked={
											mode === "edit" && props.project.status === "complete"
												? !props.project.recommend
												: undefined
										}
									/>
									<label htmlFor="recommend-no">No</label>
								</span>
							</div>
						</fieldset>
						<div>
							<ErrorList id={errAttrFields?.recommend.id} errors={errFields?.recommend} />
						</div>
					</div>
				</div>
			)}
			<div className={styles.containerErrorList}>
				<ErrorList id={errAttrForm?.id} errors={errForm} />
			</div>

			<div className={styles.formActions}>
				<button className="action primary" type="submit">
					{mode === "create" ? "Create" : "Update"} Project
				</button>
				{/* {handleReset && (
					<button className="action danger outline" type="reset" onClick={handleReset}>
						{mode === "create" ? "Clear Form" : "Revert Changes"}
					</button>
				)} */}
				<Link className="action danger outline" to={cancelRedirectUrl}>
					Cancel
				</Link>
			</div>
			{/* <div>{props.children}</div> */}
		</form>
	);
}
