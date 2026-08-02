import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: "pb-app",
	imports: [RouterOutlet],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {}
