# **TypeScript**


&nbsp;
## **Directory structure**
- The `apps` directory contains API, SPA, and fullstack app implementations (e.g. Node + Hono, React, etc.).
- The `packages` directory contains logic that is shared across apps. It is primarily split between the `library` and `core` packages. The `library` package contains general code that is not application specific, and the `core` package contains shareable code that is application context specific. 
- The `configs` directory contains shared base configurations for tools or dependencies (e.g. eslint, TypeScript, etc).

### **Apps**
- [API Json Server](./apps/api-json-server)
- [API Node + Hono](./apps/api-hono)

<!-- - [SPA Angular](./apps/spa-angular) -->
- [SPA React](./apps/spa-react)
<!-- - [SPA Qwik](./apps/spa-qwik) -->
<!-- - [SPA Solid](./apps/spa-solid) -->
<!-- - [SPA Svelte](./apps/spa-svelte) -->

<!-- - [Fullstack Astro](./apps/fullstack-astro) -->
<!-- - [Fullstack Next](./apps/fullstack-next) -->
<!-- - [Fullstack React Router](./apps/fullstack-react-router) -->
<!-- - [Fullstack SolidStart](./apps/fullstack-solidstart) -->
<!-- - [Fullstack SvelteKit](./apps/fullstack-sveltekit) -->

### **Packages**
- [Core](./packages/core)
- [Library](./packages/library)
- [Persistence (DB) Drizzle](./packages/db-drizzle)

### **Configs**
<!-- biome.jsonc must be in root folder. Ddoes not work with cli when a workspace config --> 
<!-- - [Biome](./configs/biome) -->  
<!-- - [ESlint](./configs/eslint) -->
- [Typescript](./configs/typescript)


&nbsp;
## **References**
[Data Handling](https://nextjs.org/blog/security-nextjs-server-components-actions)  
[Monorepos with Pnpm](https://levelup.video/tutorials/monorepos-with-pnpm)  
[TS Paths in a Monorepo](https://github.com/vercel/turbo/discussions/620)  


&nbsp;
## **Resources**
[Heroicons](https://heroicons.com/)  
[Reshot Free Icons & Illustrations](https://www.reshot.com/)  
