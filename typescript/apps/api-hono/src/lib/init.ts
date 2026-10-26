import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { errorHandler, notFoundHandler } from "./handlers.ts";

export function defaultApp() {
	return new Hono({ strict: false });
}

export function defaultRouter() {
	return defaultApp().basePath("/api");
}

export function createApp() {
	const app = defaultApp()
		.use(cors())
		.use(logger())
		.use(async (ctx, next) => {
			if (process.env.NODE_ENV === "development")
				ctx.res.headers.set("Application-Name", "API-Hono");
			await next();
		})

		.notFound(notFoundHandler)
		.onError(errorHandler);

	return app;
}

// export const app = createApp(); // Option: export base app instance
