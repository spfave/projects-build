import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { notFound, onError } from "#utils/route.utils.ts";

export function defaultApp() {
	return new Hono({ strict: false });
}

export function defaultRouter() {
	return defaultApp().basePath("/api");
}

export function createApp() {
	const app = defaultApp();

	app.use(cors());
	app.use(logger());

	app.notFound(notFound);
	app.onError(onError);

	return app;
}

// export const app = createApp(); // Option: export base app instance
