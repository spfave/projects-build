// Ref: https://www.totaltypescript.com/how-to-strongly-type-process-env

declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: "development" | "production" | (string & {});

		PORT: number;

		VITE_URL_API: string;
		VITE_URL_API_JSON_SERVER: string;
		VITE_URL_API_HONO: string;
		VITE_URL_API_GO: string;

		AUTH_USERNAME: string;
		AUTH_PASSWORD: string;
		AUTH_TOKEN: string;

		DB_FILE_NAME: string;
		DB_MIGRATING: "true" | "false";
		DB_SEEDING: "true" | "false";
	}
}
