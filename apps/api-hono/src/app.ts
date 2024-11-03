import { Hono } from "hono";

import projects from "#routes/projects.ts";

const app = new Hono({ strict: false });

app.route("/", projects);
app.notFound((ctx) => {
	return ctx.json({ message: `Not Found - ${ctx.req.url}` }, 404);
});
app.onError((error, ctx) => {
	return ctx.json({ message: error.message, stack: error.stack }, 500);
});

export default app;
