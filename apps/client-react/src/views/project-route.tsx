import * as React from "react";
import { Link, useNavigate, useParams, useRouteError } from "react-router";

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

	const projectQ = useAsync<Project>();
	React.useEffect(() => {
		if (!params.id) throw new Error("Parameter id must exist.");

		projectQ.run(client.getProjectById(params.id));
	}, [projectQ.run, params.id]);

	const [isPending, startTransition] = React.useTransition();
	const { fetchProjects } = useProjectsContext();
	const navigate = useNavigate();
	async function deleteProjectAction() {
		startTransition(async () => {
			if (!params.id) return;

			await client.deleteProject(params.id); // note: errors thrown in transitions are caught by error boundary
			fetchProjects();
			navigate("/projects");
		});
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
					<dd style={{ whiteSpace: "pre-wrap" }}>{project.description || "--"}</dd>
				</div>
				<div>
					<dt>Notes</dt>
					<dd style={{ whiteSpace: "pre-wrap" }}>{project.notes || "--"}</dd>
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
				<Link
					className="action primary"
					to={isPending ? "" : "edit"}
					aria-disabled={isPending}
				>
					Edit
				</Link>
				<form action={deleteProjectAction}>
					<button
						className="action danger"
						type="submit"
						name="intent"
						value="delete"
						disabled={isPending}
					>
						Delete
					</button>
				</form>
			</div>
		</section>
	);
}

export function ProjectErrorBoundary() {
	const error = useRouteError();
	return <ProjectErrorFallback error={error} />;
}

type ProjectErrorFallbackProps = { error: unknown };
function ProjectErrorFallback(props: ProjectErrorFallbackProps) {
	return (
		<GeneralErrorFallback
			error={props.error}
			// note: for custom http response status code error ui
			httpResponseErrorHandlers={{
				404: ({ params }) => (
					<div className={styles.error}>
						<p>Project with id "{params.id}" could not be found</p>
					</div>
				),
				422: ({ error, params }) => (
					<div className={styles.error}>
						{/* ui defined message */}
						<p>Invalid project id: "{params.id}"</p>
						{/* error defined message (server or api client defined) */}
						<p>{error.context.message}</p>
					</div>
				),
				// 500: () => (
				// 	<div className={styles.error}>
				// 		<p>Internal server error occurred</p>
				// 	</div>
				// ),
			}}
			// note: to override default http response error ui
			defaultHttpResponseErrorHandler={() => <p>Project request failed</p>}
			// note: for custom unexpected error ui
			unexpectedErrorHandler={<p>Oh-no an error occurred, sorry</p>}
			// else uses DefaultHttpResponseErrorFallback or DefaultErrorFallback
		/>
	);
}
