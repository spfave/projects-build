import type { Config } from "@react-router/dev/config";

export default {
	ssr: true, // Server-side render by default, to enable SPA mode set this to `false`
	prerender: ["/about"],

	future: {
		unstable_optimizeDeps: true,

		v8_middleware: true,
		v8_splitRouteModules: true,
		v8_viteEnvironmentApi: true,
	},
} satisfies Config;
