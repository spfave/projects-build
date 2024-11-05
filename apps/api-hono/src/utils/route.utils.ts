import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const notFound: NotFoundHandler = (ctx) => {
	return ctx.json({ message: `Not Found - ${ctx.req.url}` }, 404);
};

export const onError: ErrorHandler = (error, ctx) => {
	const statusCode = error instanceof HTTPException ? error.status : 500;

	return ctx.json({ message: error.message, stack: error.stack }, statusCode);
};
