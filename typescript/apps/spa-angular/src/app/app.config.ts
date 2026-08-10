import { provideHttpClient } from "@angular/common/http";
import {
	type ApplicationConfig,
	ErrorHandler,
	provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { routes } from "./app.routes";

class RootErrorHandler implements ErrorHandler {
	handleError(error: unknown): void {
		console.error("Global error handler caught error:", error); // LOG
	}
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		{ provide: ErrorHandler, useClass: RootErrorHandler },
		provideRouter(routes, withComponentInputBinding()),
		provideHttpClient(),
	],
};
