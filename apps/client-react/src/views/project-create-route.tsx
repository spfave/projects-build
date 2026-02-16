import * as React from "react";
import { Link, useNavigate } from "react-router";

import type {
	ProjectErrors,
	ProjectFields,
	ProjectInput,
	ProjectStatus,
} from "@projectsbuild/core/projects";
import { transformProject, validateProject } from "@projectsbuild/core/projects";
import { HttpResponseError } from "@projectsbuild/library/errors";
import { formErrorsAttributes, ymdToday } from "@projectsbuild/library/utils";
import ErrorList from "~/components/error-list";
import Show from "~/components/ui/show";
import * as client from "~/feature-projects/client-api-fetch";
import { useFocusInvalid } from "~/hooks/use-focus-invalid";
import { useHydrated } from "~/hooks/use-hydrated";
import { useRerender } from "~/hooks/use-rerender";
import { useProjectsContext } from "./projects-route";

import styles from "./project-create-route.module.css";

type ProjectCreateActionState = {
	data?: ProjectFields | null;
	projectErrors?: ProjectErrors | null;
	error?: string | null;
};

export default function ProjectCreateRoute() {
	const refForm = React.useRef<HTMLFormElement>(null);
	const [projectStatus, setProjectStatus] = React.useState<ProjectStatus>();

	function handleSelectProjectStatus(evt: React.ChangeEvent<HTMLSelectElement>) {
		setProjectStatus(evt.target.value as ProjectStatus);
	}

	const { fetchProjects } = useProjectsContext();
	const navigate = useNavigate();
	// Ref: https://www.youtube.com/watch?v=R0B2HsSM78s
	const [state, createProjectAction, isPending] = React.useActionState<
		ProjectCreateActionState,
		FormData
	>(async (_prevState, formData) => {
		const formObj = Object.fromEntries(formData) as ProjectFields;
		const validation = validateProject(formObj);
		if (!validation.success)
			return {
				data: formObj,
				error: "Invalid project",
				projectErrors: validation.errors,
			};

		const projectPayload = transformProject(formObj);
		try {
			const project = await client.createProject(projectPayload);
			fetchProjects();
			navigate(`/projects/${project.id}`);
			return {};
		} catch (error) {
			if (error instanceof HttpResponseError && error.context.status === 422) {
				// biome-ignore lint/suspicious/noExplicitAny: access <unknown> error.cause
				const errors = (error.cause as any)?.data?.errors as ProjectErrors | undefined;
				return { data: formObj, error: error.message, projectErrors: errors };
			} else if (error instanceof Error) {
				return { data: formObj, error: error.message };
			} else throw error;
		}
	}, {});

	const rerender = useRerender();
	function handleReset(_evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		setProjectStatus(undefined);
		// refForm.current?.reset(); // ?? needed
		state.data = null; // Note: hack to reset useActionState state variable: clears defaultValues on inputs, top-level error message, and input field errors
		state.error = null;
		state.projectErrors = null;
		rerender(); // Note: needed in case project status is unset
	}

	const { isHydrated } = useHydrated();
	const projectErrors = state?.projectErrors;
	const { form: errForm, fields: errFields } = projectErrors || {};
	const { form: errAttrForm, fields: errAttrFields } =
		formErrorsAttributes(projectErrors) || {};
	useFocusInvalid(refForm.current, Boolean(projectErrors)); // ?? Needs additional condition on hasErrors

	return (
		<section className={styles.projectCreate}>
			<h2>New Project</h2>
			<Show when={state.error}>
				<p className={styles.error}>{state.error}</p>
			</Show>
			<form
				ref={refForm}
				action={createProjectAction}
				noValidate={isHydrated}
				aria-invalid={errAttrForm?.hasErrors}
				aria-describedby={errAttrForm?.id}
				tabIndex={-1}
			>
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
							defaultValue={state.data?.name ?? ""}
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
							defaultValue={state.data?.link ?? ""}
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
						defaultValue={state.data?.description ?? ""}
						aria-invalid={errAttrFields?.description.hasErrors}
						aria-describedby={errAttrFields?.description.id}
					/>
					<div>
						<ErrorList
							id={errAttrFields?.description.id}
							errors={errFields?.description}
						/>
					</div>
				</div>
				<div>
					<label htmlFor="notes">Notes</label>
					<textarea
						id="notes"
						name="notes"
						placeholder="add notes..."
						defaultValue={state.data?.notes ?? ""}
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
							// defaultValue={state.data?.status ?? ""} // note: does not work for controlled select
							aria-invalid={errAttrFields?.status.hasErrors}
							aria-describedby={errAttrFields?.status.id}
						>
							<option hidden value="">
								select status
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
								// defaultValue={
								// 	state.data?.status === "complete"
								// 		? state.data?.dateCompleted
								// 		: undefined
								// }
								defaultValue={state.data?.dateCompleted ?? ""} // temp
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
								// @ts-expect-error: optional chaining check over type narrowing
								defaultValue={state.data?.rating ?? ""}
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
											// @ts-expect-error: optional chaining check over type narrowing
											defaultChecked={state.data?.recommend === "true"}
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
											// @ts-expect-error: optional chaining check over type narrowing
											defaultChecked={state.data?.recommend === "false"}
										/>
										<label htmlFor="recommend-no">No</label>
									</span>
								</div>
							</fieldset>
							<div>
								<ErrorList
									id={errAttrFields?.recommend.id}
									errors={errFields?.recommend}
								/>
							</div>
						</div>
					</div>
				)}
				<div className={styles.containerErrorList}>
					<ErrorList id={errAttrForm?.id} errors={errForm} />
				</div>

				<div className={styles.formActions}>
					<button className="action primary" type="submit" disabled={isPending}>
						{isPending ? "Creating..." : "Create Project"}
					</button>
					<button
						className="action danger outline"
						type="reset"
						onClick={handleReset}
						disabled={isPending}
					>
						Clear Form
					</button>
					<Link
						className="action danger outline"
						to={isPending ? "" : "/projects"}
						aria-disabled={isPending}
					>
						Cancel
					</Link>
				</div>
			</form>
		</section>
	);
}
