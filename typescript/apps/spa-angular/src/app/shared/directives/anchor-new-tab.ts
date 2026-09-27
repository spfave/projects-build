import { Directive } from "@angular/core";

@Directive({
	selector: "a[pbATab]",
	host: {
		"[attr.target]": '"_blank"',
		"[attr.rel]": '"noreferrer"',
	},
})
export class ATab {}
