import * as React from "react";
import { Link, useNavigate, useParams } from "react-router";

import type { Project } from "@projectsbuild/core/projects";
import { ymdPretty } from "@projectsbuild/library/utils";
import GeneralErrorFallback from "~/components/error-fallback";
import Show from "~/components/ui/show";
import * as client from "~/feature-projects/client-api-fetch";
import { useAsync } from "~/hooks/use-async";
import { useProjectsContext } from "./projects-route";

import styles from "./project-route.module.css";

export default function ProjectRoute() {
	const params = useParams();
	const navigate = useNavigate();
	const { fetchProjects } = useProjectsContext();

	const projectQ = useAsync<Project>();
	React.useEffect(() => {
		if (!params.id) throw new Error("Parameter id must exist.");

		projectQ.run(client.getProjectById(params.id));
	}, [projectQ.run, params.id]);

	async function handleDeleteProject(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		if (!params.id) return;

		await client.deleteProjectById(params.id);
		fetchProjects();
		navigate("/projects");
	}

	if (projectQ.isPending) return <div>Loading Project...</div>;
	if (projectQ.error) return <ProjectErrorFallback error={projectQ.error} />;

	const project = projectQ.data as Project;
	return (
		<section key={project.id} className={styles.project}>
			<h2>{project.name}</h2>
			<dl className={styles.projectContent}>
				<div>
					<dt>Status</dt>
					<dd>{project.status}</dd>
				</div>
				<div>
					<dt>Link</dt>
					<dd>
						<Show when={project.link} fallback={"--"}>
							<a href={project.link} target="_blank" rel="noreferrer">
								{project.link}
							</a>
						</Show>
					</dd>
				</div>
				<div>
					<dt>Description</dt>
					<dd>{project.description || "--"}</dd>
				</div>
				<div>
					<dt>Notes</dt>
					<dd>{project.notes || "--"}</dd>
				</div>
				<Show when={project.status === "complete" ? project : false}>
					{(project) => (
						<>
							<div>
								<dt>Date Completed</dt>
								<dd>
									<time dateTime={project.dateCompleted}>
										{ymdPretty(project.dateCompleted)}
									</time>
								</dd>
							</div>
							<div>
								<dt>Build Rating</dt>
								<dd>{project.rating}</dd>
							</div>
							<div>
								<dt>Recommend Build</dt>
								<dd>{project.recommend ? "Yes" : "No"}</dd>
							</div>
						</>
					)}
				</Show>
			</dl>
			<div className={styles.projectActions}>
				<Link className="action primary" to="edit">
					Edit
				</Link>
				<form method="POST" onSubmit={handleDeleteProject}>
					<button className="action danger" type="submit" name="intent" value="delete">
						Delete
					</button>
				</form>
			</div>
		</section>
	);
}

type ProjectErrorFallbackProps = { error: unknown };
function ProjectErrorFallback(props: ProjectErrorFallbackProps) {
	return (
		<GeneralErrorFallback
			error={props.error}
			httpResponseErrorHandlers={{
				404: ({ params }) => (
					<div
						style={{
							background: "var(--color-danger)",
							color: "white",
							fontWeight: "bold",
							display: "flex",
							justifyContent: "center",
							padding: "1rem",
						}}
					>
						<p>No project with id "{params.id}" could be found</p>
					</div>
				),
			}}
			defaultHttpResponseErrorHandler={() => <p>Project could not be found</p>}
			unexpectedErrorHandler={<p>Oh-no an error occurred, sorry</p>}
		/>
	);
}
