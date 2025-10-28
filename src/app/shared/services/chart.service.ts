import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { Observable } from 'rxjs';
import { Workout, WorkoutRequestDTO, WorkoutShort} from '../../_interfaces/workout.model';
import { WorkoutExerciseMaxWeight, WorkoutExerciseVolume } from '../../_interfaces/workout-exercise.model';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {}

  getExercisesVolume(): Observable<WorkoutExerciseVolume[]> {
    return this.http.get<any[]>(this.createCompleteRoute("chart/volume", this.envUrl.apiUrlAddress));
  }

  getExercisesMaxWeight(): Observable<WorkoutExerciseMaxWeight[]> {
    return this.http.get<any[]>(this.createCompleteRoute("chart/max-weight", this.envUrl.apiUrlAddress));
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}${route}`;
  }

}
