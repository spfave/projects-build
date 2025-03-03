import { Link, Outlet, href } from "react-router";

import { REPO_URL } from "@projectsbuild/shared/projects";

import githubIcon from "@projectsbuild/shared/assets/github.svg";
import infoIcon from "@projectsbuild/shared/assets/heroicons-information-circle.svg";
import logoIcon from "@projectsbuild/shared/assets/reshot-icon-planning.svg";

export default function RootLayout() {
	return (
		<>
			<header className="flex h-16 items-center justify-between px-4 py-0">
				<div className="flex items-center gap-4">
					<img width={48} src={logoIcon} alt="Project.build logo" />
					<Link to={href("/projects")}>
						<h1>
							<span className="font-black text-[2rem] uppercase">projects</span>
							<span className="font-bold text-[1.25rem]">.build</span>
						</h1>
					</Link>
				</div>
				<div className="flex gap-4">
					<Link to={href("/about")} title="about">
						<img width={24} src={infoIcon} alt="about icon" />
					</Link>
					<Link to={REPO_URL} target="_blank" title="source code">
						<img width={24} src={githubIcon} alt="github icon" />
					</Link>
				</div>
			</header>
			<main className="grow p-4">
				<Outlet />
			</main>
		</>
	);
}
