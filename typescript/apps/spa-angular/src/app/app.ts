import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: "pb-app",
	imports: [RouterOutlet],
	template: ` <router-outlet /> `,
	styles: ``,
})
export class App {}
