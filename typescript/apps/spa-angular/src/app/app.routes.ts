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
				// providers: [provideHttpClient(withInterceptors([]), withRequestsMadeViaParent())], // provide subroute specific interceptors and include parent interceptors
				children: [
					{ path: "", component: ProjectIndexPage },
					{ path: "create", component: ProjectCreatePage },
					{ path: ":projectId", component: ProjectPage },
					{ path: ":projectId/edit", component: ProjectEditPage },
				],
			},
			{
				path: "demos",
				children: [
					{ path: "project-loading/:projIdParam", component: ProjectLoadingPage },
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
