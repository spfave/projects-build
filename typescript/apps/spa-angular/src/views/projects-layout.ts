import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: "pb-projects-layout",
	imports: [RouterOutlet],
	template: `<router-outlet />`,
	styles: ``,
})
export class ProjectsLayout {}
