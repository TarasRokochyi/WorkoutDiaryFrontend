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

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((x: HttpErrorResponse) => {
        debugger
        if (x.status === 401) {
          return this.handleAuthError(x, req, next);
        }
        return throwError(() => x);
      })
    );
  }

  private handleAuthError(err: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const service = this.inject.get(AuthService);

    return service.refreshToken().pipe(
      switchMap(() => {
        const newToken = localStorage.getItem('token');
        if (newToken) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          return next.handle(cloned);
        } else {
          service.revokeToken();
          return throwError(() => 'Token refresh failed');
        }
      }),
      catchError((refreshErr: any) => {
        service.revokeToken();
        return throwError(() => refreshErr);
      })
    );
  }
}

