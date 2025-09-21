import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { Observable } from 'rxjs';
import { Workout, WorkoutRequestDTO } from '../../_interfaces/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {}


  createWorkout(workout: WorkoutRequestDTO): Observable<any> {
    return this.http.post<any>(this.createCompleteRoute("workout", this.envUrl.apiUrlAddress), workout);
  }

  updateWorkout(id: number, workout: WorkoutRequestDTO): Observable<Workout> {
    debugger
    return this.http.put<any>(this.createCompleteRoute(`workout/${id}`, this.envUrl.apiUrlAddress), workout);
  }

  getWorkoutById(id: number): Observable<Workout> {
    return this.http.get<any>(this.createCompleteRoute(`workout/${id}`, this.envUrl.apiUrlAddress));
  }

  getWorkouts(): Observable<Workout[]> {
    return this.http.get<any[]>(this.createCompleteRoute("workout", this.envUrl.apiUrlAddress));
  }

  deleteWorkout(id: number): Observable<void>{
    return this.http.delete<any>(this.createCompleteRoute(`workout/${id}`, this.envUrl.apiUrlAddress))
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
