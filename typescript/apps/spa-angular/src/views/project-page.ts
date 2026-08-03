import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "pb-project-page",
	imports: [],
	template: ` <p>project-page works!</p> `,
	styles: ``,
})
export class ProjectPage {
	private route = inject(ActivatedRoute);

	constructor() {
		const id = this.route.snapshot.paramMap.get("id");
		console.info(`id: `, id); // DEBUG LOG
	}
}
