import * as React from "react";

import type { ProjectStatus } from "@projectsbuild/types";

import styles from "./project-create-route.module.css";

export default function ProjectCreateRoute() {
	const [projectStatus, setProjectStatus] = React.useState<ProjectStatus>();

	function handleChangeStatus(evt: React.ChangeEvent<HTMLSelectElement>) {
		setProjectStatus(evt.target.value as ProjectStatus);
	}

	return (
		<div className={styles.projectCreate}>
			<h2>Define New Project</h2>
			<form>
				<div className="form-field">
					<label htmlFor="name" className="block">
						Name
					</label>
					<input id="name" type="text" name="name" />
				</div>
				<div className="form-field">
					<label htmlFor="link" className="block">
						Link
					</label>
					<input id="link" type="text" name="link" />
				</div>
				<div className="form-field">
					<label htmlFor="description" className="block">
						Description
					</label>
					<textarea id="description" name="description" />
				</div>
				<div className="form-field">
					<label htmlFor="notes" className="block">
						Notes
					</label>
					<textarea id="notes" name="notes" />
				</div>
				<div className="form-field">
					<label htmlFor="status" className="block">
						Status
					</label>
					<select
						id="status"
						name="status"
						defaultValue="select"
						value={projectStatus}
						onChange={handleChangeStatus}
					>
						<option value="select" hidden>
							Select a Status
						</option>
						<option value="planning">Planning</option>
						<option value="building">Building</option>
						<option value="complete">Complete</option>
					</select>
				</div>

				{projectStatus === "complete" && (
					<>
						<div className="form-field">
							<label htmlFor="dateCompleted" className="block">
								Date completed
							</label>
							<input id="dateCompleted" type="date" name="dateCompleted" />
						</div>
						<div className="form-field">
							<label htmlFor="rating" className="block">
								Rating
							</label>
							<input id="rating" type="number" name="rating" min={1} max={5} />
						</div>
						<div className="form-field">
							<fieldset>
								<legend>Would you recommend</legend>
								<div>
									<span>
										<input
											id="recommend-yes"
											type="radio"
											value="true"
											name="recommend"
										/>
										<label htmlFor="recommend-yes">Yes</label>
									</span>
									<span>
										<input
											id="recommend-no"
											type="radio"
											value="false"
											name="recommend"
										/>
										<label htmlFor="recommend-no">No</label>
									</span>
								</div>
							</fieldset>
						</div>
					</>
				)}

				<div>
					<button type="submit">Create Project</button>
				</div>
			</form>
		</div>
	);
}
