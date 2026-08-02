import { Directive, ElementRef, inject } from "@angular/core";

@Directive({
	selector: "a[pbATab]",
	host: {},
})
export class ATab {
	private el: ElementRef<HTMLAnchorElement> = inject(ElementRef<HTMLAnchorElement>);

	constructor() {
		this.el.nativeElement.target = "_blank";
		this.el.nativeElement.rel = "noreferrer";
	}
}
