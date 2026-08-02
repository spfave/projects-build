import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: "pb-app",
	imports: [RouterOutlet],
	template: `
		<main class="main">
			<h1>SPA Angular</h1>
		</main>
		<router-outlet />
	`,
	styles: ``,
})
export class App {}
