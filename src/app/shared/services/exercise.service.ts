import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  getEquipmentNames(): Observable<string[]> {
    return this.http.get<string[]>(this.createCompleteRoute('exercise/equipment', this.envUrl.apiUrlAddress));
  }

  getRecommendationsByEquipmentNames(names: string[], difficulty?: string): Observable<any[]> {
    return this.http.post<any[]>(
      this.createCompleteRoute('exercise/exercise-recommendation/manual', this.envUrl.apiUrlAddress),
      { equipmentNames: names, difficulty: difficulty || null }
    );
  }

  uploadImageWithDifficulty(file: File, difficulty?: string): Observable<any> {
    const form = new FormData();
    form.append('image', file, file.name);
    const params = difficulty ? `?difficulty=${difficulty}` : '';
    return this.http.post<any>(this.createCompleteRoute(`exercise/exercise-recommendation${params}`, this.envUrl.apiUrlAddress), form);
  }

  uploadImage(file: File): Observable<any> {

    const form = new FormData();
    form.append('image', file, file.name);

    return this.http.post<any>(this.createCompleteRoute("exercise/exercise-recommendation", this.envUrl.apiUrlAddress), form)
    // .pipe(
    //   // you can add transformation here if your backend returns a different shape
    //   map(resp => resp)
    // );
  }

  private selectedExercisesSubject = new BehaviorSubject<Exercise[]>([]);
  selectedExercises$ = this.selectedExercisesSubject.asObservable();

  setSelectedExercises(exercises: Exercise[]) {
    debugger
    this.selectedExercisesSubject.next(exercises);
  }

  resetSelectedExercises() {
    this.selectedExercisesSubject.next([]);
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
