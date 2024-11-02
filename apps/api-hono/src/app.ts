import { Hono } from "hono";

const app = new Hono();

app.get("/", (ctx) => {
	return ctx.json({ message: "Hello Hono!" });
});

app.notFound((ctx) => {
	return ctx.json({ message: `Not Found - ${ctx.req.url}` }, 404);
});

app.onError((error, ctx) => {
	return ctx.json({ message: error.message, stack: error.stack }, 500);
});

export default app;
