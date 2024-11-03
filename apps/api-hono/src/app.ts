import { Hono } from "hono";

const app = new Hono({ strict: false });

app.get("/projects", (ctx) => {
	return ctx.json({ message: "all projects" });
});

app.get("/projects/:id", (ctx) => {
	return ctx.json({ message: `get project with id: ${ctx.req.param("id")}` });
});

app.post("/projects", (ctx) => {
	return ctx.json({ message: "create project" });
});

app.patch("/projects/:id", (ctx) => {
	return ctx.json({ message: `update project with id: ${ctx.req.param("id")}` });
});

app.delete("/projects/:id", (ctx) => {
	return ctx.json({ message: `delete project with id: ${ctx.req.param("id")}` });
});

app.notFound((ctx) => {
	return ctx.json({ message: `Not Found - ${ctx.req.url}` }, 404);
});

app.onError((error, ctx) => {
	return ctx.json({ message: error.message, stack: error.stack }, 500);
});

export default app;
