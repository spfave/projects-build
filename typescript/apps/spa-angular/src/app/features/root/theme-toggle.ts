import { Component, effect, signal } from "@angular/core";

import systemThemeIcon from "@projectsbuild/core/assets/heroicons-computer-desktop.svg";
import darkThemeIcon from "@projectsbuild/core/assets/heroicons-moon.svg";
import lightThemeIcon from "@projectsbuild/core/assets/heroicons-sun.svg";

type Theme = (typeof THEMES)[number];
const THEMES = ["system", "light", "dark"] as const;
const keyTheme = "theme";

@Component({
	selector: "pb-theme-toggle",
	imports: [],
	template: `
		<!-- <select value={theme} (change)="theme.set($any($event.target).value)">
			<option id="theme-option-system" value="system">
				System
			</option>
			<option id="theme-option-light" value="light">
				Light
			</option>
			<option id="theme-option-dark" value="dark">
				Dark
			</option>
		</select> -->
		<button type="button" (click)="nextTheme()">
			@switch (theme()) {
				@case ("system") {
					<img height="24" [src]="systemThemeIcon" alt="system theme icon" />
				}
				@case ("light") {
					<img height="24" [src]="lightThemeIcon" alt="light theme icon" />
				}
				@case ("dark") {
					<img height="24" [src]="darkThemeIcon" alt="dark theme icon" />
				}
			}
		</button>
	`,
	styles: `
		button {
			background: none;
			border: none;
			padding: 0;
			cursor: pointer;
			display: contents;
		}
	`,
})
export class ThemeToggle {
	protected readonly systemThemeIcon = systemThemeIcon;
	protected readonly lightThemeIcon = lightThemeIcon;
	protected readonly darkThemeIcon = darkThemeIcon;

	protected readonly theme = signal<Theme>(
		// (localStorage.getItem(keyTheme) as Theme) || "system"
		(() => {
			const storageTheme = localStorage.getItem(keyTheme) as Theme;
			return THEMES.includes(storageTheme) ? storageTheme : "system";
		})()
	);
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: define effect
	private readonly themeStorageEffect = effect(() => {
		document.documentElement.setAttribute("data-theme", this.theme());
		localStorage.setItem(keyTheme, this.theme());
	});

	protected nextTheme() {
		const currentIndex = THEMES.indexOf(this.theme());
		const nextIndex = (currentIndex + 1) % THEMES.length;
		this.theme.set(THEMES[nextIndex] || "system");
	}
}
