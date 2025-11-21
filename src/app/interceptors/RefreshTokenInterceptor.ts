import { Injectable, Injector } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http"
import { catchError, Observable, of, switchMap, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar"
import { __importDefault } from "tslib";
import { Route, Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor{

    constructor(private inject: Injector){}

//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         return next.handle(req).pipe(
//         catchError((x: HttpErrorResponse) => {
//             if (x.status === 401) {
//             return this.handleAuthError(x, req, next);
//             }
//             return throwError(() => x);
//         })
//         );
//     }

//   private handleAuthError(err: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
//     const service = this.inject.get(AuthService);

//     return service.refreshToken().pipe(
//       switchMap(() => {
//         const newToken = localStorage.getItem('token');
//         if (newToken) {
//           const cloned = req.clone({
//             setHeaders: {
//               Authorization: `Bearer ${newToken}`,
//             },
//           });
//           return next.handle(cloned);
//         } else {
//           service.revokeToken();
//           return throwError(() => 'Token refresh failed');
//         }
//       }),
//       catchError((refreshErr: any) => {
//         service.revokeToken();
//         return throwError(() => refreshErr);
//       })
//     );
//   }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authService = this.inject.get(AuthService);
        const token = authService.getAccessToken();

        debugger
        let authReq = req;
        if (token) {

            authReq = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + token)
            });

            // authReq = req.clone({
            // setHeaders: { Authorization: `Bearer ${token}` }
            // });
        }

        // Always check for an in-progress refresh before making a new request
        // This handles the edge case where a refresh just finished, but the new token
        // isn't available yet.
        if (authService.getRefreshTokenInProgress()) {
            debugger
            return authService.getRefreshTokenStream().pipe(
            switchMap((newToken) => {
                debugger

                const retriedReq = req.clone({
                    headers: req.headers.set("Authorization",
                        "Bearer " + token)
                });
                // const retriedReq = req.clone({
                // setHeaders: { Authorization: `Bearer ${newToken}` }
                // });
                return next.handle(retriedReq);
            })
            );
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                return this.handleAuthError(req, next, authService);
            }
            return throwError(() => error);
            })
        );
    };

    private handleAuthError(req: HttpRequest<any>, next: HttpHandler, authService: AuthService): Observable<any> {
        debugger
        return authService.refreshToken().pipe(
        switchMap((newToken) => {
            // Retry the original request with the new token
            debugger

            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + newToken)
            });
            // const cloned = req.clone({
            // setHeaders: {
            //     Authorization: `Bearer ${newToken}`,
            // },
            // });
            return next.handle(cloned);
        }),
        catchError((refreshErr) => {
            return throwError(() => refreshErr);
        })
        );
    }

}

