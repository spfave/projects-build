import { createApp } from "#lib/core-app.ts";
import apiDemos from "#routes/demos.ts";
import { apiProjects } from "#routes/projects-rpc.ts";

const app = createApp();

// export type App = typeof appRoutes;
// const appRoutes = app.route("/", apiDemos).route("/", apiProjects);

const appRoutes = [apiDemos, apiProjects] as const;
appRoutes.forEach((r, _) => app.route("/", r));

export type AppRoutes = (typeof appRoutes)[number];
export default app;

// ----------------------------------------------------------------------------------- //
// Alternate option: import app with routes previously added directly in routes/* definitions

// import { app } from "./lib/core-app.ts";
