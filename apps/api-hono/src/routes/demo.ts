import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { HTTPException } from "hono/http-exception";

const api = new Hono().basePath("/demo");

api.use(
	"/auth-basic",
	basicAuth({
		username: "seabass",
		password: "demo-apis",
		invalidUserMessage: (ctx) => {
			throw new HTTPException(401, { message: "Not Authenticated" });
		},
	})
);
api.get("/auth-basic", (ctx) => {
	console.log(ctx.newResponse(null).status);
	return ctx.json({ message: "Authenticated - Basically" }, 200);
});

export default api;
