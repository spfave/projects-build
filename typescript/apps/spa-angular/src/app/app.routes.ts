import { Component } from "@angular/core";
import type { Routes } from "@angular/router";

import { ProjectCreatePage } from "~/views/project-create-page";
import { ProjectEditPage } from "~/views/project-edit-page";
import { ProjectLoadingPage } from "~/views/project-loading-page";
import { ProjectPage } from "~/views/project-page";
import { ProjectsLayout } from "~/views/projects-layout";
import { Root } from "~/views/root";

@Component({
	selector: "pb-not-found-page",
	template: ` <div>Page Not Found</div> `,
})
class NotFoundPage {}

@Component({
	selector: "pb-project-index-page",
	template: ` <p>Create or select a project to get started</p> `,
})
class ProjectIndexPage {}

export const routes: Routes = [
	{
		path: "",
		component: Root,
		children: [
			{ path: "", redirectTo: "projects", pathMatch: "full" },
			{
				path: "projects",
				component: ProjectsLayout,
				children: [
					{ path: "", component: ProjectIndexPage },
					{ path: "create", component: ProjectCreatePage },
					{ path: ":id", component: ProjectPage },
					{ path: ":projIdParam/loading-demo", component: ProjectLoadingPage },
					{ path: ":id/edit", component: ProjectEditPage },
				],
			},
			{
				path: "about",
				title: "About | Projects.build",
				loadComponent: () => import("~/views/about-page").then((m) => m.AboutPage),
			},
			{ path: "**", component: NotFoundPage },
		],
	},
];
