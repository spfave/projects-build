# **Projects.build**

## **Goal**
Primary: Build experience, methodologies and opinions around web application engineering.  
Secondary: Experiment with different web technologies, web development frameworks, and languages. 


&nbsp;
## **Approach**
Develop a web application to manage and rate project builds with multiple web technologies. Through solving the same problem with different approaches discover where boundaries of application concerns exist for abstraction to shareable logic, preferred patterns for code organization around co-location, and management of a largely self dependent code base. 

Each app implementation purposefully use a bare minimum set of dependencies to focus the app engineering on using the primitives supplied with the libraries, frameworks, and languages and limit external dependency decision making. This is for the purpose of experimenting with these primitives as building blocks and understanding where it makes sense to favor abstraction to an external dependency. 


&nbsp;
## **Repo Contents**
This monorepo contains client rendered JS apps, api endpoint server apps, server rendered apps, and fullstack JS framework apps. Each app is a component (i.e. client SPA or api endpoints) for composition into a fullstack web application or a fullstack web application itself. Each fullstack application implementation provides the same functionality, to create and manage a list of project builds. 

- The `apps` directory contains the client, api, server, and fullstack app implementations (e.g. React, Remix, etc.).

- The `packages` directory mostly contains logic that is shared across apps. It is primarily split between the `library` and `shared` packages. The `library` package contains general code that is not application specific, and the `shared` package contains shareable code that is application context specific. 

- The `configs` directory contains shared base configurations for tools or dependencies (e.g. eslint, typescript, etc).


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
- [Library](./packages/library)
- [Shared](./packages/shared)
<!-- - [DB Schema](./packages/db-schema) -->

&nbsp;
## **Configs**
<!-- biome.json must be in root folder, does not work as workspace config: https://github.com/biomejs/biome-vscode/issues/25 --> 
<!-- - [Biome](./configs/biome) -->  
<!-- - [ESlint](./configs/eslint) -->
- [Typescript](./configs/typescript)


&nbsp;
## **Resources**
- [Heroicons](https://heroicons.com/)
- [Reshot Free Icons & Illustrations](https://www.reshot.com/)

&nbsp;
## **Notes**
- [Monorepos with Pnpm](https://levelup.video/tutorials/monorepos-with-pnpm)
- [TS Paths in a Monorepo](https://github.com/vercel/turbo/discussions/620)