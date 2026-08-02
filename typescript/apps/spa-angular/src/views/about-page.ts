import { Component } from "@angular/core";

import { ATab } from "~/directives/anchor-new-tab";

const repoUrl = "https://github.com/spfave/projects-build";

@Component({
	selector: "pb-about-page",
	imports: [ATab],
	template: `
		<section class="about">
			<h2>About</h2>
			<div>
				<p>
					This app is one version of the <a pbATab [href]="repoUrl">Projects.build</a> app built
					in pursuit of building experience in web application engineering and
					experimenting with different web technologies.
				</p>
				<p>
					This implementation is a client rendered
					<a pbATab href="https://angular.dev/">Angular</a> app. The implementation purposefully
					use a bare minimum set of dependencies to focus app development on using the
					primitives supplied with Angular and limit external dependency decision making.
					This is for the purpose of experimenting with the primitives as building blocks
					and understanding where it makes sense to favor abstraction to an external
					dependency.
				</p>
				<p>
					The app code base additionally over-engineers overall code organization,
					function & type utilities, and code logic abstractions. This is for the purpose
					of experimenting with development in a monorepo and logic co-location patterns,
					advanced JavaScript/TypeScript capabilities and patterns, and code architecture
					patterns.
				</p>
				<p>
					Additional implementations of the app can be found on
					<a pbATab [href]="repoUrl">Github</a>.
				</p>
			</div>
		</section>
	`,
	styles: `
		.about {
			max-width: 90ch;
			margin: auto;
			> * + * {
				margin-block-start: 1rem;
			}

			div {
				> * + * {
					margin-block-start: 2rem;
				}

				p {
					line-height: 1.6rem;
				}

				a {
					font-style: italic;
					color: hsl(214, 67%, 48%);
				}
			}
		}
	`,
})
export class AboutPage {
	protected readonly repoUrl = repoUrl;
}
