import { Hono } from "hono";
import { logger } from "hono/logger";

import demoApis from "#routes/demo.ts";
import projectApis from "#routes/projects.ts";
import { notFound, onError } from "#utils/route.utils.ts";

const app = new Hono({ strict: false }).basePath("/api");

app.use(logger());

app.route("/", demoApis);
app.route("/", projectApis);
app.notFound(notFound);
app.onError(onError);

export default app;
