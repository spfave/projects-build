import { Hono } from "hono";

import projects from "#routes/projects.ts";
import { notFound, onError } from "#utils/route.utils.ts";

const app = new Hono({ strict: false }).basePath("/api");

app.route("/", projects);
app.notFound(notFound);
app.onError(onError);

export default app;
