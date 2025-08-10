import { Injectable, Injector } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http"
import { catchError, Observable, of, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar"
import { __importDefault } from "tslib";
import { Route, Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor{

    constructor(private inject: Injector, private router: Router, private _snackBar: MatSnackBar){}
    ctr = 0

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(req).pipe(catchError(x => this.handleAuthError(x)));
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any>{
        if (err && err.status === 401 && this.ctr != 1){
            this.ctr++
            let service = this.inject.get(AuthService)
            service.refreshToken().subscribe({
                next: (x:any) => {
                    this._snackBar.open("tokens refreshed, try again", "Close", {duration: 3000})
                    return of("We refreshed the token");
                },
                error: (err:any) => {
                    service.revokeToken()
                }
            });
            return of("attemitng to refresh tokens")
        }
        else{
            this.ctr = 0
            return throwError(() => new Error("Error: " + err.message))
        }
    }
}
