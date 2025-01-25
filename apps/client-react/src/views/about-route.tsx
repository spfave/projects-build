import { repoUrl } from "~/views/root";

import styles from "./about-route.module.css";

export default function About() {
	return (
		<section className={styles.about}>
			<h2>About</h2>
			<div>
				<p>
					This app is one version of the <ANewTab text="Projects.build" href={repoUrl} />{" "}
					app built in pursuit of building experience in web application engineering and
					experimenting with different web technologies.
				</p>
				<p>
					This implementation is a client rendered{" "}
					<ANewTab text="Vite" href="https://vitejs.dev/" /> &{" "}
					<ANewTab text="React" href="https://react.dev/" /> app with a sole additional
					dependency on{" "}
					<ANewTab text="React Router" href="https://reactrouter.com/en/main" />. The
					implementation purposefully use a bare minimum set of dependencies to focus app
					development on using the primitives supplied with React and limit external
					dependency decision making. This is for the purpose of experimenting with the
					primitives as building blocks and understanding where it makes sense to favor
					abstraction to an external dependency.
				</p>
				<p>
					The app code base additionally over-engineers overall code organization,
					function & type utilities, and code logic abstractions. This is for the purpose
					of experimenting with development in a monorepo and logic co-location patterns,
					advanced JavaScript/TypeScript capabilities and patterns, and code architecture
					patterns.
				</p>
				<p>
					Additional implementations of the app can be found on{" "}
					<ANewTab text="Github" href={repoUrl} />.
				</p>
			</div>
		</section>
	);
}

function ANewTab(props: { href: string; text: string }) {
	return (
		<a href={props.href} target="_blank" rel="noreferrer">
			{props.text}
		</a>
	);
}
