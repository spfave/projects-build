import * as React from "react";
import { Link, Outlet } from "react-router";

import githubIcon from "@projectsbuild/core/assets/github.svg";
import infoIcon from "@projectsbuild/core/assets/heroicons-information-circle.svg";
import logoIcon from "@projectsbuild/core/assets/reshot-icon-planning.svg";
import styles from "./root.module.css";

export const repoUrl = "https://github.com/spfave/projects-build";

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
					<ThemeToggle />
					<Link to="about" title="about">
						<img height={24} src={infoIcon} alt="about icon" />
					</Link>
					<Link to={repoUrl} target="_blank" title="source code">
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

// theme toggle refs:
// https://www.youtube.com/watch?v=F1s8MZoGVL8&list=WL&index=7&t=263s
// https://github.com/pacocoursey/next-themes/tree/main

type Theme = "system" | "light" | "dark";
const keyTheme = "theme";

function ThemeToggle() {
	const [theme, setTheme] = React.useState<Theme>(
		(localStorage.getItem(keyTheme) as Theme) || "system"
	);
	React.useEffect(() => {
		localStorage.setItem(keyTheme, theme);
	}, [theme]);

	return (
		<select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
			<option id="theme-option-system" value="system">
				System
			</option>
			<option id="theme-option-light" value="light">
				Light
			</option>
			<option id="theme-option-dark" value="dark">
				Dark
			</option>
		</select>
	);
}
