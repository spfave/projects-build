import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: "pb-root",
	imports: [RouterOutlet],
	template: `
		<p>root works!</p>
		<router-outlet />
	`,
	styles: `
		p {
			color: purple;
		}
	`,
})
export class Root {}
