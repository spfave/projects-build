import { serve } from "@hono/node-server";

import app from "./app.ts";

const port = Number(process.env.PORT) || 5002;

// biome-ignore format: single line per argument
const server = serve(
	{ fetch: app.fetch, port },
	(info) => console.log(`Server is running on http://localhost:${info.port}`)
);

function cleanup() {
	console.info(`\nShutting down server`);
	server.close(() => process.exit(0));
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
