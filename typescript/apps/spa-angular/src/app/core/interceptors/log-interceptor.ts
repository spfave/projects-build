import type { HttpInterceptorFn } from "@angular/common/http";
import { tap } from "rxjs";

export const logInterceptor: HttpInterceptorFn = (req, next) => {
	console.info(`Log before request:`, req); // LOG
	return next(req).pipe(tap((e) => console.log(`Log after request:`, e)));
	// const n = next(req);
	// console.info(`Log after request:`, n); // LOG
	// return n;
};
