import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../_interfaces/user.model';
import { EnvironmentUrlService } from './environment-url.service';
import { UpdatePassword } from '../../_interfaces/updatePassword.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }


  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.createCompleteRoute("user", this.envUrl.apiUrlAddress));
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(this.createCompleteRoute("user", this.envUrl.apiUrlAddress), user);
  }

  updatePassword(newPassword: UpdatePassword){
    return this.http.put(this.createCompleteRoute("user/update-password", this.envUrl.apiUrlAddress), newPassword)
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
