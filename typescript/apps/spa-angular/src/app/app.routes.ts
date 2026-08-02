import { Component } from "@angular/core";
import type { Routes } from "@angular/router";

import { AboutPage } from "~/views/about-page";
import { ProjectsLayout } from "~/views/projects-layout";
import { Root } from "~/views/root";

@Component({
	selector: "pb-not-found-page",
	template: `
		<div>Page Not Found</div>
	`,
})
class NotFoundPage {}

export const routes: Routes = [
	{
		path: "",
		component: Root,
		children: [
			{ path: "", redirectTo: "projects", pathMatch: "full" },
			{ path: "projects", component: ProjectsLayout, children: [] },
			{ path: "about", title: "About | Projects.build", component: AboutPage },
			{ path: "**", component: NotFoundPage },
		],
	},
];
