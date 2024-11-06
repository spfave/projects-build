import { serve } from "@hono/node-server";

import app from "./app.ts";

const port = Number(process.env.PORT) || 5002;

console.log(`Server is running on http://localhost:${port}`);
serve({
	fetch: app.fetch,
	port,
});
