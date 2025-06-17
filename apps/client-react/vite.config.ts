import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: { "~": path.resolve(__dirname, "./src") },
	},

	server: {
		port: 3001,
		proxy: { "/api": { target: "http://localhost:5003", changeOrigin: true } },
	},
	envDir: "../../",
});
