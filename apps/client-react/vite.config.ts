import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const viteEnv = loadEnv("", "../../", "VITE");

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: { "~": path.resolve(__dirname, "./src") },
	},

	server: {
		port: 3001,
		proxy: {
			"/api": {
				target: `http://localhost:${viteEnv.VITE_PROXY_PORT}`,
				changeOrigin: true,
			},
		},
	},
	envDir: "../../",
});
