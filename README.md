# **Projects.build**

## **Goal**
Implement a project build rating web application with various JavaScript and web development frameworks and languages to experiment with their primitives for web application design. 


&nbsp;
## **Summary**
This monorepo contains client rendered JS apps, api endpoint server apps, server rendered apps, and fullstack JS framework apps. Each app is a component (i.e. client SPA or api endpoints) for composition into a fullstack web application or a fullstack web application itself. Each fullstack application implementation provides the same functionality, to create, rate, and manage a list of project builds. 

These app implementations purposefully use a bare minimum set of dependencies to focus the app development and design on using the primitives supplied with the UI libraries, frameworks, and languages and limit external dependency decision making. This is for the purpose of experimenting with these primitives as building blocks and understanding where it makes sense to favor logic abstraction to an external dependency. 


&nbsp;
## **Apps**
- [Client React](./apps/client-react)
<!-- - [Client Solid](./apps/client-solid) -->
<!-- - [Client Svelte](./apps/client-svelte) -->
<!-- - [Client Qwik](./apps/client-qwik) -->

<!-- - [API Node + Fastify](./apps/api-node-fastify) -->

<!-- - [Server Go + HTMX](./apps/server-go-htmx) -->

<!-- - [Fullstack Astro](./apps/fullstack-astro) -->
<!-- - [Fullstack Next](./apps/fullstack-next) -->
<!-- - [Fullstack Remix](./apps/fullstack-remix) -->
<!-- - [Fullstack SolidStart](./apps/fullstack-solidstart) -->
<!-- - [Fullstack SvelteKit](./apps/fullstack-sveltekit) -->
<!-- - [Fullstack Leptos](./apps/fullstack-leptos) -->

&nbsp;
## **Packages**
- [API Json Server](./packages/api-json-server)
<!-- - [DB Schema](./packages/db-schema) -->
<!-- - [TS Types](./packages/types) -->

&nbsp;
## **Configs**
<!-- - [Biome](./configs/biome) -->  <!-- biome.json must be in root folder, does not work as workspace config: https://github.com/biomejs/biome-vscode/issues/25 --> 
<!-- - [ESlint](./configs/eslint) -->
- [Typescript](./configs/typescript)

&nbsp;
## **Notes**
- [Monorepos with Pnpm](https://levelup.video/tutorials/monorepos-with-pnpm)