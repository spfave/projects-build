import type { Routes } from "@angular/router";

import { AboutPage } from "~/views/about-page";
import { ProjectsLayout } from "~/views/projects-layout";
import { Root } from "~/views/root";

export const routes: Routes = [
	{
		path: "",
		component: Root,
		children: [
			{ path: "", redirectTo: "projects", pathMatch: "full" },
			{ path: "projects", component: ProjectsLayout, children: [] },
			{ path: "about", component: AboutPage },
		],
	},
];
