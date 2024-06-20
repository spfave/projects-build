import styles from "./about-route.module.css";

export default function About() {
	return (
		<div className={styles.about}>
			<h2>About</h2>
			<div>
				<p>
					This app is one version of the{" "}
					<ANewTab
						text="Projects.build"
						href="https://github.com/spfave/projects-build"
					/>{" "}
					app built in pursuit of building experience in web application engineering and
					experimenting with different web development technologies.
				</p>
				<p>
					This implementation is a client rendered{" "}
					<ANewTab text="Vite" href="https://vitejs.dev/" /> &{" "}
					<ANewTab text="React" href="https://react.dev/" /> app with a single dependency
					on <ANewTab text="React Router" href="https://reactrouter.com/en/main" />. The
					implementation purposefully use a bare minimum set of dependencies to focus
					development on using the primitives supplied with React and limit external
					dependency decision making. This is for the purpose of experimenting with the
					primitives as building blocks and understanding where it would makes sense to
					favor abstraction to an external dependency.
				</p>
				<p>
					Additional implementations of the app can be found on{" "}
					<ANewTab text="Github" href="https://github.com/spfave/projects-build" />.
				</p>
			</div>
		</div>
	);
}

function ANewTab(props: { href: string; text: string }) {
	return (
		<a href={props.href} target="_blank" rel="noreferrer">
			{props.text}
		</a>
	);
}
