import { AsyncPipe } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";

@Component({
	selector: "pb-project-page",
	imports: [AsyncPipe],
	template: `
		<p>Viewing project</p>
		<p>Id: {{ projectId() }} signal</p>
		<p>Id: {{ projectId$ | async }} observable</p>
	`,
	styles: ``,
})
export class ProjectPage {
	protected readonly projectId = input.required<string>(); // URL param

	#route = inject(ActivatedRoute);
	protected readonly projectId$ = this.#route.paramMap.pipe(
		map((params) => params.get("projectId"))
	);
}
