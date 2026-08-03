import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

import { ATab } from "~/directives/anchor-new-tab";

import githubIcon from "@projectsbuild/core/assets/github.svg";
import infoIcon from "@projectsbuild/core/assets/heroicons-information-circle.svg";
import logoIcon from "@projectsbuild/core/assets/reshot-icon-planning.svg";

export const repoUrl = "https://github.com/spfave/projects-build";

@Component({
	selector: "pb-root",
	imports: [RouterLink, RouterOutlet, ATab],
	template: `
		<header>
			<div>
				<img height="48" [src]="logoIcon" alt="Project.build logo" />
				<a routerLink="projects">
					<h1>
						<span>projects</span>
						<span>.build</span>
					</h1>
				</a>
			</div>
			<div>
				<!-- Theme toggle -->
				<a routerLink="about" title="about">
					<img height="24" [src]="infoIcon" alt="about icon" />
				</a>
				<a pbATab [href]="repoUrl" title="source code">
					<img height="24" [src]="githubIcon" alt="github icon" />
				</a>
			</div>
		</header>
		<main>
			<router-outlet />
		</main>
	`,
	styles: `
		:host {
			display: block;
		}

		header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 4rem;
			padding: 0 1rem;

			& div:first-child {
				display: flex;
				gap: 1rem;
				align-items: center;

				h1 {
					margin: 0;

					& span:first-child {
						font-size: 2rem;
						font-weight: 900;
						text-transform: uppercase;
					}

					& span:last-child {
						font-size: 1.25rem;
						font-weight: 700;
					}
				}
			}

			& div:nth-child(2) {
				display: flex;
				gap: 1rem;

				a {
					display: contents;
				}
			}
		}

		main {
			flex-grow: 1;
			padding: 1rem;
		}
	`,
})
export class Root {
	protected readonly repoUrl = repoUrl;
	protected readonly githubIcon = githubIcon;
	protected readonly infoIcon = infoIcon;
	protected readonly logoIcon = logoIcon;
}
