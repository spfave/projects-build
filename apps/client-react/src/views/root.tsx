import { Link, Outlet } from "react-router";

import { REPO_URL } from "@projectsbuild/core/projects";

import githubIcon from "@projectsbuild/core/assets/github.svg";
import infoIcon from "@projectsbuild/core/assets/heroicons-information-circle.svg";
import logoIcon from "@projectsbuild/core/assets/reshot-icon-planning.svg";
import styles from "./root.module.css";

export default function Root() {
	return (
		<>
			<header className={styles.header}>
				<div>
					<img height={48} src={logoIcon} alt="Project.build logo" />
					<Link to="projects">
						<h1>
							<span>projects</span>
							<span>.build</span>
						</h1>
					</Link>
				</div>
				<div>
					<Link to="about" title="about">
						<img height={24} src={infoIcon} alt="about icon" />
					</Link>
					<Link to={REPO_URL} target="_blank" title="source code">
						<img height={24} src={githubIcon} alt="github icon" />
					</Link>
				</div>
			</header>
			<main className={styles.main}>
				<Outlet />
			</main>
		</>
	);
}
