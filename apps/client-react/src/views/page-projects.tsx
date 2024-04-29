import { LayoutHeader, LayoutMain } from "./layout";

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
				</div>
			</LayoutHeader>
			<LayoutMain>
				<div className={styles.projectsContent}>Projects Grid</div>
			</LayoutMain>
		</>
	);
}
