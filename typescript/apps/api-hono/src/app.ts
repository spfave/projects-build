import { createApp } from "#lib/init.ts";
import { demoRouter } from "#routes/demo.ts";
import { projectRouter } from "#routes/project-rpc.ts";

const app = createApp();

// export type App = typeof appRouter;
// const appRouter = app.route("/", demosRouter).route("/", projectsRouter);

const appRouters = [demoRouter, projectRouter] as const;
appRouters.forEach((r) => {
	app.route("/", r);
});

export type AppRouter = (typeof appRouters)[number];
export default app;

// ----------------------------------------------------------------------------------- //
// Alternate option: import app with routes previously added directly in routes/* definitions

// import { app } from "./lib/init.ts";
