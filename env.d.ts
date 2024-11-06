// Ref: https://www.totaltypescript.com/how-to-strongly-type-process-env

declare namespace NodeJS {
	interface ProcessEnv {
		VITE_URL_API_JSON_SERVER: string;

		AUTH_USERNAME: string;
		AUTH_PASSWORD: string;
		AUTH_TOKEN: string;

		DATABASE_FILE_NAME: string;
	}
}
