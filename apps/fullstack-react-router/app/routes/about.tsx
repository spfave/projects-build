import { repoUrl } from "~/layouts/root-layout";
import type { Route } from "./+types/about";

export const meta: Route.MetaFunction = (args) => [{ title: "About | Projects.build" }];

export default function About() {
	return (
		<section className="mx-auto grid max-w-[90ch] gap-4">
			<h2 className="font-bold text-2xl">About</h2>
			<div className="grid gap-8">
				<p className="leading-6">
					This app is one version of the <ANewTab text="Projects.build" href={repoUrl} />{" "}
					app built in pursuit of building experience in web application engineering and
					experimenting with different web technologies.
				</p>
				<p className="leading-6">
					This implementation is a fullstack SSR rendered{" "}
					<ANewTab text="React Router" href="https://reactrouter.com/home" /> &{" "}
					<ANewTab text="React" href="https://react.dev/" /> app with an additional
					dependency on <ANewTab text="Tailwind" href="https://tailwindcss.com/" /> for
					styling. The implementation purposefully use a bare minimum set of dependencies
					to focus app development on using the primitives supplied with React and React
					Router and limit external dependency decision making. This is for the purpose of
					experimenting with the primitives as building blocks and understanding where it
					makes sense to favor abstraction to an external dependency.
				</p>
				<p className="leading-6">
					The app code base additionally over-engineers overall code organization,
					function & type utilities, and code logic abstractions. This is for the purpose
					of experimenting with development in a monorepo and logic co-location patterns,
					advanced JavaScript/TypeScript capabilities and patterns, and code architecture
					patterns.
				</p>
				<p className="leading-6">
					Additional implementations of the app can be found on{" "}
					<ANewTab text="Github" href={repoUrl} />.
				</p>
			</div>
		</section>
	);
}

function ANewTab(props: { href: string; text: string }) {
	return (
		<a
			className="text-blue-500 italic"
			href={props.href}
			target="_blank"
			rel="noreferrer"
		>
			{props.text}
		</a>
	);
}
