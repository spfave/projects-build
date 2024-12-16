import { getConnInfo } from "@hono/node-server/conninfo";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { bearerAuth } from "hono/bearer-auth";
import { HTTPException } from "hono/http-exception";
import { ipRestriction } from "hono/ip-restriction";
import { requestId } from "hono/request-id";
import { timeout } from "hono/timeout";
import { validator } from "hono/validator";

const api = new Hono().basePath("/demo");

// Endpoint demos
api.get("/error", (ctx) => {
	throw new Error("Endpoint Error");
});

// Middleware demos
api.use(
	"/auth-basic",
	basicAuth({
		username: process.env.AUTH_USERNAME,
		password: process.env.AUTH_PASSWORD,
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
		token: process.env.AUTH_TOKEN,
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
	return ctx.json({ message: "Request completed in time allowed" }, 200);
});

// Ref: https://github.com/rhinobase/hono-rate-limiter
// api.use("/rate-limit",)
// api.get("/rate-limiter", (ctx) => {});

// Validator demos
function isStringParsableInt(value: string): boolean {
	return Number(value) === Number.parseInt(value, 10);
}

api.get(
	"/validate-path-query-params/prm1/:p1/prm2/:p2",
	validator("param", (params, ctx) => {
		console.info("\nVALIDATOR PARAMS"); //LOG
		console.info(`params: `, params); //LOG

		const { p1, p2 } = params;
		const validP1 = p1 && isStringParsableInt(p1) ? Number(p1) : 0;
		const validP2 = p2 && isStringParsableInt(p2) ? Number(p2) : 0;

		return { p1: validP1, p2: validP2 };
	}),
	validator("query", (qParams, ctx) => {
		console.info("\nVALIDATOR QUERY PARAMS"); //LOG
		console.info(`qParams: `, qParams); //LOG

		const { qp1, qp2, qp3, qpAry } = qParams;
		const validQP1 =
			qp1 && !Array.isArray(qp1) && isStringParsableInt(qp1) ? Number(qp1) : 0;

		return { qp1: validQP1, qp2, qp3, qpAry };
	}),
	async (ctx) => {
		console.info("\nROUTE PARAMS AND QUERIES"); //LOG

		const reqParams = ctx.req.param();
		const reqQuery = ctx.req.query();
		const reqQueries = ctx.req.queries();
		console.info(`reqParams: `, reqParams); //LOG
		console.info(`reqQuery: `, reqQuery); //LOG
		console.info(`reqQueries: `, reqQueries); //LOG

		const validParams = ctx.req.valid("param");
		const validQuery = ctx.req.valid("query");
		console.info(`validParams: `, validParams); //LOG
		console.info(`validQuery: `, validQuery); //LOG

		return ctx.json({ reqParams, reqQuery, reqQueries, validParams, validQuery }, 200);
	}
);

api.post(
	"/validate-form",
	validator("form", (form, ctx) => {
		console.info("\nVALIDATOR FORM"); //LOG
		console.info(`form: `, form); //LOG

		const { todo, content, complete } = form;
		if (!todo || Array.isArray(todo) || typeof todo !== "string" || todo.length < 2)
			return ctx.json({ msg: "Invalid todo" }, 422);
		if (
			!content ||
			Array.isArray(content) ||
			typeof content !== "string" ||
			content.length < 10
		)
			return ctx.json({ msg: "Invalid content" }, 422);
		if (
			!complete ||
			Array.isArray(complete) ||
			typeof complete !== "string" ||
			!["true", "false"].includes(complete)
		)
			return ctx.json({ msg: "Invalid complete status" }, 422);

		return { todo, content, complete: complete === "true" };
	}),
	async (ctx) => {
		console.info("\nROUTE FORM"); //LOG

		// const reqForm = await ctx.req.formData();
		const reqForm = Object.fromEntries(await ctx.req.formData());
		console.info(`reqForm: `, reqForm); //LOG

		const validForm = ctx.req.valid("form");
		console.info(`validForm: `, validForm); //LOG

		return ctx.json({ reqForm, validForm }, 200);
	}
);

api.post(
	"/validate-json",
	validator("json", (json, ctx) => {
		console.info("\nVALIDATOR JSON"); //LOG
		console.info(`json: `, json); //LOG

		const { todo, content, complete } = json;
		if (!todo || typeof todo !== "string" || todo.length < 2)
			return ctx.json({ msg: "Invalid todo" }, 422);
		if (!content || typeof content !== "string" || content.length < 10)
			return ctx.json({ msg: "Invalid content" }, 422);
		if (typeof complete !== "boolean")
			return ctx.json({ msg: "Invalid complete status" }, 422);

		return { todo: todo.toUpperCase(), content, complete };
	}),
	async (ctx) => {
		console.info("\nROUTE JSON BODY"); //LOG

		const reqJson = await ctx.req.json();
		console.info(`reqForm: `, reqJson); //LOG

		const validJson = ctx.req.valid("json");
		console.info(`validForm: `, validJson); //LOG

		return ctx.json({ reqJson, validJson }, 200);
	}
);

export default api;
