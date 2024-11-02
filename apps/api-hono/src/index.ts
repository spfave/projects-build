import { serve } from "@hono/node-server";
import { Hono } from "hono";

const port = 5001;
const app = new Hono();

app.get("/", (ctx) => {
	return ctx.text("Hello Hono!");
});

console.log(`Server is running on http://localhost:${port}`);
serve({
	fetch: app.fetch,
	port,
});
