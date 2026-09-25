import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
	type ApplicationConfig,
	ErrorHandler,
	provideBrowserGlobalErrorListeners,
} from "@angular/core";
import {
	provideRouter,
	withComponentInputBinding,
	withViewTransitions,
} from "@angular/router";

import { routes } from "./app.routes";
import { httpClientErrorInterceptor } from "./core/interceptors/http-client-error-interceptor";
import { logInterceptor } from "./core/interceptors/log-interceptor";

class RootErrorHandler implements ErrorHandler {
	handleError(error: unknown): void {
		console.error("Global error handler caught error:", error); // LOG
	}
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		{ provide: ErrorHandler, useClass: RootErrorHandler },
		provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
		provideHttpClient(
			withInterceptors([
				// logInterceptor,
				httpClientErrorInterceptor,
			])
		),
	],
};
