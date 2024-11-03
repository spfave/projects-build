import type { ErrorHandler, NotFoundHandler } from "hono";

export const notFound: NotFoundHandler = (ctx) => {
	return ctx.json({ message: `Not Found - ${ctx.req.url}` }, 404);
};

export const onError: ErrorHandler = (error, ctx) => {
	return ctx.json({ message: error.message, stack: error.stack }, 500);
};
