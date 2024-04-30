import { Link, Outlet } from "react-router-dom";

import githubIcon from "~/assets/github.svg";
import infoIcon from "~/assets/heroicons-information-circle.svg";
import logoIcon from "~/assets/reshot-icon-planning.svg";
import styles from "./root.module.css";

export default function Root() {
	return (
		<>
			<header className={styles.header}>
				<div>
					<img height={48} src={logoIcon} alt="Project.build logo icon" />
					<Link to="/projects">
						<h1>
							<span>projects</span>
							<span>.build</span>
						</h1>
					</Link>
				</div>
				<div>
					<Link to="/about">
						<img height={24} color="red" src={infoIcon} alt="info icon" />
					</Link>
					<Link to="https://github.com/spfave/projects-build" target="_blank">
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
