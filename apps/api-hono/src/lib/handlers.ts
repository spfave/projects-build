import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";

import { HttpStatus } from "@projectsbuild/library/constants";
import { jSend } from "@projectsbuild/library/utils";

export const notFound: NotFoundHandler = (ctx) => {
	return ctx.json(
		jSend({ status: "fail", message: `not found - ${ctx.req.url}` }),
		HttpStatus.NOT_FOUND.code
	);
};

export const onError: ErrorHandler = (error, ctx) => {
	console.info(`error: `, error); //LOG
	const statusCode =
		error instanceof HTTPException ? error.status : HttpStatus.INTERNAL_SERVER_ERROR.code;
	const env = process.env.NODE_ENV;

	return ctx.json(
		jSend({
			status: "error",
			message: error.message || HttpStatus.INTERNAL_SERVER_ERROR.phrase,
			data: { stack: env === "development" ? error.stack : undefined },
		}),
		statusCode
	);
};
