import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkoutTemplateRequestDTO, WorkoutTemplate } from '../../_interfaces/workout-template.model';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutTemplateService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {}

  createWorkoutTemplate(workoutTemplate: WorkoutTemplateRequestDTO): Observable<any> {
    return this.http.post<any>(this.createCompleteRoute("workouttemplate", this.envUrl.apiUrlAddress), workoutTemplate);
  }

  updateWorkoutTemplate(id: number, workoutTemplate: WorkoutTemplateRequestDTO): Observable<any> {
    return this.http.put<any>(this.createCompleteRoute(`workouttemplate/${id}`, this.envUrl.apiUrlAddress), workoutTemplate);
  }

  getWorkoutTemplateById(id: number): Observable<WorkoutTemplate> {
    return this.http.get<any>(this.createCompleteRoute(`workouttemplate/${id}`, this.envUrl.apiUrlAddress));
  }

  getWorkoutTemplates(): Observable<WorkoutTemplate[]> {
    return this.http.get<any[]>(this.createCompleteRoute("workouttemplate", this.envUrl.apiUrlAddress));
  }

  deleteWorkoutTemplate(id: number): Observable<void>{
    return this.http.delete<any>(this.createCompleteRoute(`workouttemplate/${id}`, this.envUrl.apiUrlAddress))
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
