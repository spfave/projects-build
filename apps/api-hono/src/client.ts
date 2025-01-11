// Ref:
// - https://hono.dev/docs/guides/rpc#using-rpc-with-larger-applications
// - https://hono.dev/docs/guides/best-practices#building-a-larger-application
// - https://hono.dev/examples/grouping-routes-rpc
// - https://github.com/m-shaka/hono-rpc-perf-tips-example
// - https://catalins.tech/hono-rpc-in-monorepos/

import { hc } from "hono/client";

// import { type ApiProject, hcApiProjectsTyped } from "#routes/projects-rpc.ts";
import type { AppRoutes } from "./app.ts";

// ----------------------------------------------------------------------------------- //
// App rpc client

// const clientA = hc<App>("");
// clientA.api.v1.projects.

// const clientR = hc<AppRoutes>("");
// clientR.api.v1.projects.

// Create compiled typed client
// const client = hc<AppRoutes>("");
// export type Client = typeof client;
type Client = ReturnType<typeof hc<AppRoutes>>;
export default function hcAppTyped(...args: Parameters<typeof hc>): Client {
	return hc<AppRoutes>(...args);
}

// ----------------------------------------------------------------------------------- //
// App sub-route rpc client

// const clientAP = hc<ApiProject>("");
// clientAP.api.v1.projects.

// const clientAPT = hcApiProjectsTyped("");
// clientAPT.api.v1.projects.
