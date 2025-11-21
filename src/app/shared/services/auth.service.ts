import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { Login } from '../../_interfaces/login.model';
import { Register } from '../../_interfaces/register.model'
import { Authentication } from '../../_interfaces/authentication.model'
import { BehaviorSubject, catchError, filter, finalize, Observable, of, shareReplay, switchMap, take, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private snackBar = inject(MatSnackBar)

  private httpBackend : HttpClient;

  constructor(private handler: HttpBackend ,private http: HttpClient, private envUrl: EnvironmentUrlService) {
    this.httpBackend = new HttpClient(handler)
  }

  login(loginModel: Login) {
    return this.http.post<Authentication>(this.createCompleteRoute("user/token", this.envUrl.apiUrlAddress), loginModel)
    .pipe(
      tap((res: Authentication) => {
        if(res.isAuthenticated == true){
          localStorage.setItem('token', res.token);
          localStorage.setItem('refreshToken', res.refreshToken)
          this.loggedInStatus.next(true);
        }
        else{
          throw Error(res.message)
        }
      })
    );
  }

  register(registerModel: Register) {
    return this.http.post(this.createCompleteRoute('user/register', this.envUrl.apiUrlAddress), registerModel, {responseType: 'text'});
  }

  // refreshToken(){
  //   return this.http.post<Authentication>(this.createCompleteRoute("user/refresh-token", this.envUrl.apiUrlAddress), {RefreshToken: localStorage.getItem('refreshToken')} )
  //   .pipe(
  //     tap((res: Authentication) => {
  //       localStorage.setItem('token', res.token)
  //       localStorage.setItem('refreshToken', res.refreshToken)
  //     })
  //   )
  // }

  private loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());

  public isLoggedIn$ = this.loggedInStatus.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem("token");
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}${route}`;
  }

  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  getRefreshTokenInProgress(){
    return this.refreshTokenInProgress;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('token');
  }

  isNotNull<T>(value: T): value is NonNullable<T> {
    return value != null; // Checks for both null and undefined
  }

  // Use this observable in the interceptor to wait for a new token
  getRefreshTokenStream(): Observable<string> {
    return this.refreshTokenSubject.pipe(
      filter(value => value != null), // Only emit when a valid token is available
      take(1) // Take only one value and complete
    ) as Observable<string>;
  }

  refreshToken(): Observable<string> {
    debugger
    if (this.refreshTokenInProgress) {
      return this.getRefreshTokenStream();
    }

    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(null); // Clear the token value to signal a pending refresh

    return this.httpBackend.post<any>(this.createCompleteRoute('user/refresh-token', this.envUrl.apiUrlAddress), {
      RefreshToken: localStorage.getItem('refreshToken')
    }).pipe(
      // shareReplay(1) ensures only one network request
      shareReplay(1),
      switchMap(response => {
        debugger
        const newToken = response.token;
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.refreshTokenSubject.next(newToken); // Emit the new token
        this.refreshTokenInProgress = false;
        return of(newToken);
      }),
      catchError((error) => {
        this.refreshTokenSubject.error(error)
        this.refreshTokenInProgress = false;
        this.revokeToken(); // Logout user on refresh failure
        return throwError(() => error);
      }),
      finalize(() => this.refreshTokenInProgress = false)
    );
  }

  revokeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.loggedInStatus.next(false)
  }

}
