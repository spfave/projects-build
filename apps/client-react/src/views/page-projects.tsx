import { LayoutContent, LayoutHeader } from "./layout";

import icon from "~/assets/reshot-icon-planning.svg";
import styles from "./page-projects.module.css";

export default function PageProjects() {
	return (
		<>
			<LayoutHeader>
				<div className={styles.projectsHeader}>
					<h1>
						<span>projects</span>
						<span>.build</span>
					</h1>
					{/* <img height={48} src={icon} alt="Project.build logo icon" /> */}
				</div>
			</LayoutHeader>
			<LayoutContent>
				<div className={styles.projectsContent}>Projects Grid</div>
			</LayoutContent>
		</>
	);
}
