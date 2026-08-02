import { Component } from "@angular/core";
import type { Routes } from "@angular/router";

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
			{
				path: "about",
				title: "About | Projects.build",
				loadComponent: () => import("~/views/about-page").then((m) => m.AboutPage),
			},
			{ path: "**", component: NotFoundPage },
		],
	},
];
