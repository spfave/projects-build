/// <reference types="vite/client" />

// Ref: https://vite.dev/guide/env-and-mode#intellisense-for-typescript
interface ImportMetaEnv {
	readonly VITE_URL_API_JSON_SERVER: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
