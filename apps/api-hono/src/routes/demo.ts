import { getConnInfo } from "@hono/node-server/conninfo";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { bearerAuth } from "hono/bearer-auth";
import { HTTPException } from "hono/http-exception";
import { ipRestriction } from "hono/ip-restriction";
import { requestId } from "hono/request-id";
import { timeout } from "hono/timeout";

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

api.use(
	"/restrict-ip",
	ipRestriction(
		getConnInfo,
		{
			denyList: ["127.0.0.1"],
			allowList: [],
		},
		(remote, ctx) => {
			return ctx.json(
				{ message: `Blocking access from ${remote.type} ${remote.addr}` },
				403
			);
		}
	)
);
api.get("/restrict-ip", (ctx) => {
	return ctx.json({ message: "Your ip made it through", ...getConnInfo(ctx) }, 200);
});

api.use("/request-id", requestId()).get((ctx) => {
	console.debug("requestId:", ctx.var.requestId);
	return ctx.json({ message: `Request id is ${ctx.get("requestId")}` }, 200);
});

api.use(
	"/timeout/*",
	timeout(
		1000 * 3,
		(ctx) =>
			new HTTPException(408, {
				message: `Request timeout after waiting ${ctx.req.header("d")} seconds.`,
			})
	)
);
api.get("/timeout/:time?", async (ctx) => {
	console.info(`params: `, ctx.req.param()); //LOG
	console.info(`query param: `, ctx.req.query("time")); //LOG

	const delay = Number(ctx.req.param("time") ?? ctx.req.query("time")) || 1000 * 5;
	await new Promise((resolve, reject) => setTimeout(resolve, delay));
	return ctx.json({ message: "Request completed in time allowed" });
});

// Ref: https://github.com/rhinobase/hono-rate-limiter
// api.use("/rate-limit",)
// api.get("/rate-limiter", (ctx) => {});

export default api;
