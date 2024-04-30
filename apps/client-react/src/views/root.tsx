import { Outlet } from "react-router-dom";

import icon from "~/assets/reshot-icon-planning.svg";
import styles from "./root.module.css";

export default function Root() {
	return (
		<>
			<header className={styles.header}>
				<div>
					<img height={48} src={icon} alt="Project.build logo icon" />
					<h1>
						<span>projects</span>
						<span>.build</span>
					</h1>
				</div>
				{/* <div></div> */}
			</header>
			<main className={styles.main}>
				<Outlet />
			</main>
		</>
	);
}
