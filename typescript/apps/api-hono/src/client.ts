// Ref:
// - https://hono.dev/docs/guides/rpc#using-rpc-with-larger-applications
// - https://hono.dev/docs/guides/best-practices#building-a-larger-application
// - https://hono.dev/examples/grouping-routes-rpc
// - https://github.com/m-shaka/hono-rpc-perf-tips-example
// - https://catalins.tech/hono-rpc-in-monorepos/

import { hc } from "hono/client";

// import { type ProjectsRouter, hcProjectsClientTyped } from "#routes/projects-rpc.ts";
import type { AppRouter } from "./app.ts";

// ----------------------------------------------------------------------------------- //
// App rpc client

// const clientA = hc<App>("");
// clientA.api.v1.projects.

// const clientR = hc<AppRouter>("");
// clientR.api.v1.projects.

// Create compiled typed client
// const client = hc<AppRouter>("");
// export type Client = typeof client;
type Client = ReturnType<typeof hc<AppRouter>>;
export default function hcAppTyped(...args: Parameters<typeof hc>): Client {
	return hc<AppRouter>(...args);
}

// ----------------------------------------------------------------------------------- //
// App sub-route rpc client

// const clientPR = hc<ProjectsRouter>("");
// clientPR.api.v1.projects.

// const clientPCT = hcProjectsClientTyped("");
// clientPCT.api.v1.projects.
