import { serve } from "@hono/node-server";

import app from "./app.ts";

const port = Number(process.env.PORT) || 5002;

// biome-ignore format: single line per argument
serve(
	{ fetch: app.fetch, port },
	(info) => console.log(`Server is running on http://localhost:${info.port}`)
);
