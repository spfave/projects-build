import { HttpEventType, type HttpInterceptorFn } from "@angular/common/http";
import { catchError, retry, tap } from "rxjs";

export const httpClientErrorInterceptor: HttpInterceptorFn = (req, next) => {
	return next(req).pipe(
		// retry({ count: 1, delay: 250 }),
		tap((evt) => {
			if (evt.type === HttpEventType.DownloadProgress) {
			}
		}),
		catchError((error) => {
			// console.info(`Http Client Error Interceptor Catch`); // LOG
			// if (error instanceof HttpErrorResponse) throw transformHttpClientError(error);
			throw error;
		})
	);
};

// Refs:
//	http interceptors: https://www.youtube.com/watch?v=BNM5203kxgs
// route scoped interceptors: https://www.youtube.com/watch?v=KJj8E8jJcxw
// http context: https://www.youtube.com/watch?v=3JCB_ddZ-Ww
