import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { Login } from '../../_interfaces/login.model';
import { Register } from '../../_interfaces/register.model'
import { Authentication } from '../../_interfaces/authentication.model'
import { BehaviorSubject, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private snackBar = inject(MatSnackBar)

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {}

  test(){
    return this.http.get(this.createCompleteRoute("user/test", this.envUrl.apiUrlAddress))
  }

  login(loginModel: Login) {
    debugger
    return this.http.post<Authentication>(this.createCompleteRoute("user/token", this.envUrl.apiUrlAddress), loginModel)
    .pipe(
      tap((res: Authentication) => {
        debugger;
        if(res.isAuthenticated == true){
          localStorage.setItem('token', res.token);
          localStorage.setItem('refreshToken', res.refreshToken)
          this.loggedInStatus.next(true);
        }
        else{
          debugger
          throw Error(res.message)
        }
      })
    );
  }

  register(registerModel: Register) {
    return this.http.post(this.createCompleteRoute('user/register', this.envUrl.apiUrlAddress), registerModel, {responseType: 'text'});
  }

  refreshToken(){
    return this.http.post<Authentication>(this.createCompleteRoute("user/refresh-token", this.envUrl.apiUrlAddress), {RefreshToken: localStorage.getItem('refreshToken')} )
    .pipe(
      tap((res: Authentication) => {
        localStorage.setItem('refreshToken', res.refreshToken)
      })
    )
  }

  revokeToken(){
    //debugger
    //return this.http.post(this.createCompleteRoute("user/revoke-token", this.envUrl.apiUrlAddress), {token: localStorage.getItem("refreshToken")})
    //.pipe(
    //  tap(() => {
    //    debugger
    //    this.removeTokens()
    //  })
    //)
    this.removeTokens()
  }

  removeTokens(){
    debugger
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    this.loggedInStatus.next(false)
    return
  }

  private loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());

  public isLoggedIn$ = this.loggedInStatus.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem("token");
  }


  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}${route}`;
  }

  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }
}
