import * as React from "react";

import Show from "./ui/show";

import systemThemeIcon from "@projectsbuild/core/assets/heroicons-computer-desktop.svg";
import darkThemeIcon from "@projectsbuild/core/assets/heroicons-moon.svg";
import lightThemeIcon from "@projectsbuild/core/assets/heroicons-sun.svg";

// Refs: Theme Switcher/Toggle
// https://www.youtube.com/watch?v=F1s8MZoGVL8&list=WL&index=7&t=263s
// https://github.com/pacocoursey/next-themes/tree/main

type Theme = (typeof THEMES)[number];
const THEMES = ["system", "light", "dark"] as const;
const keyTheme = "theme";

export default function ThemeToggle() {
	const [theme, setTheme] = React.useState<Theme>(
		(localStorage.getItem(keyTheme) as Theme) || "system"
	);
	React.useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem(keyTheme, theme);
	}, [theme]);

	function nextTheme() {
		const currentIndex = THEMES.indexOf(theme);
		const nextIndex = (currentIndex + 1) % THEMES.length;
		setTheme(THEMES[nextIndex] || "system");
	}

	return (
		<>
			{/* <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
				<option id="theme-option-system" value="system">
					System
				</option>
				<option id="theme-option-light" value="light">
					Light
				</option>
				<option id="theme-option-dark" value="dark">
					Dark
				</option>
			</select> */}
			<button
				style={{
					background: "none",
					border: "none",
					padding: 0,
					cursor: "pointer",
					display: "contents",
				}}
				type="button"
				onClick={nextTheme}
			>
				<Show when={theme === "system"}>
					<img height={24} src={systemThemeIcon} alt="system theme icon" />
				</Show>
				<Show when={theme === "light"}>
					<img height={24} src={lightThemeIcon} alt="light theme icon" />
				</Show>
				<Show when={theme === "dark"}>
					<img height={24} src={darkThemeIcon} alt="dark theme icon" />
				</Show>
			</button>
		</>
	);
}
