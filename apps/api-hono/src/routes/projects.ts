import { Hono } from "hono";

const api = new Hono().basePath("/v1/projects");

api.get("/", (ctx) => {
	return ctx.json({ message: "all projects" });
});

api.get("/:id", (ctx) => {
	return ctx.json({ message: `get project with id: ${ctx.req.param("id")}` });
});

api.post("/", (ctx) => {
	return ctx.json({ message: "create project" });
});

api.patch("/:id", (ctx) => {
	return ctx.json({ message: `update project with id: ${ctx.req.param("id")}` });
});

api.delete("/:id", (ctx) => {
	return ctx.json({ message: `delete project with id: ${ctx.req.param("id")}` });
});

export default api;
// export { api };
