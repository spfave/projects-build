import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const viteEnv = loadEnv("", "../../../", "VITE");

// https://vitejs.dev/config/
export default defineConfig({
	envDir: "../../../",
	plugins: [react()],
	resolve: {
		tsconfigPaths: true,
	},

	server: {
		host: "127.0.0.1",
		port: 3001,
		proxy: {
			"/api": {
				target: `http://localhost:${viteEnv.VITE_PROXY_PORT}`,
				changeOrigin: true,
			},
		},
	},
});
