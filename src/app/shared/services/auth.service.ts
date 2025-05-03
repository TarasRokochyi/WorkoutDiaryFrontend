import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { Login } from '../../_interfaces/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {}

  login(route: string, loginModel: Login) {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.apiUrlAddress), loginModel);
  }

  register(route: string, data: { email: string; password: string; name: string }) {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.apiUrlAddress), data);
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
