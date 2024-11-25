import { Hono } from "hono";
import { logger } from "hono/logger";

import demoApis from "#routes/demo.ts";
import projectApis from "#routes/projects.ts";
import { notFound, onError } from "#utils/route.utils.ts";

export function createRouter() {
	return new Hono({ strict: false });
}

export function createApp() {
	const app = createRouter().basePath("/api");
	app.use(logger());

	app.notFound(notFound);
	app.onError(onError);

	return app;
}

const app = createApp();

app.route("/", demoApis);
app.route("/", projectApis);

export default app;
