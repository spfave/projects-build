import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { bearerAuth } from "hono/bearer-auth";
import { HTTPException } from "hono/http-exception";

const api = new Hono().basePath("/demo");

api.use(
	"/auth-basic",
	basicAuth({
		username: "demo-auth-usrn",
		password: "demo-auth-pswd",
		invalidUserMessage: (ctx) => {
			throw new HTTPException(401, {
				message: "Not Authenticated - Invalid Credentials",
			});
		},
	})
);
api.get("/auth-basic", (ctx) => {
	console.log(ctx.newResponse(null).status);
	return ctx.json({ message: "Authenticated - Basically" }, 200);
});

api.use(
	"/auth-bearer",
	bearerAuth({
		token: "demo-auth-tkn",
		invalidTokenMessage: (ctx) => {
			throw new HTTPException(401, {
				message: "Not Authenticated - Invalid Bearer Token",
			});
		},
	})
);
api.get("/auth-bearer", (ctx) => {
	console.log(ctx.newResponse(null).status);
	return ctx.json({ message: "Authenticated - Bearer" }, 200);
});

export default api;
