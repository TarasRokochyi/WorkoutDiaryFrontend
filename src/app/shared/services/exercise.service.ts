import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../../_interfaces/exercise.model';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {


  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {}

  getExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.createCompleteRoute("exercise", this.envUrl.apiUrlAddress));
  }

  createExercise(exercise: Partial<Exercise>): Observable<Exercise> {
    return this.http.post<Exercise>(this.createCompleteRoute("exercise", this.envUrl.apiUrlAddress), exercise);
  }

  getExerciseById(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(this.createCompleteRoute(`exercise/${id}`, this.envUrl.apiUrlAddress));
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
