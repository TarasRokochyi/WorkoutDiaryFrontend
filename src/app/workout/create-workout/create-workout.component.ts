import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { WorkoutService } from '../../shared/services/workout.service';
import { ExerciseService } from '../../shared/services/exercise.service';
import { Workout, WorkoutRequestDTO } from '../../_interfaces/workout.model';
import { Exercise } from '../../_interfaces/exercise.model';
import { WorkoutExerciseRequestDTO, WorkoutExerciseResponse } from '../../_interfaces/workout-exercise.model';
import { Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-workout',
  standalone: false,
  templateUrl: './create-workout.component.html',
  styleUrls: ['./create-workout.component.css']
})
export class WorkoutCreateComponent implements OnInit {
  workoutForm!: FormGroup;
  workout?: Workout;

  constructor(private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService, 
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.exerciseService.selectedExercises$.pipe(
      take(1)  // take only the first emission
    ).subscribe(exercises => {
      debugger
      this.workout = {
        workoutId: 0,
        name: "",
        date: new Date(),
        duration: 0,
        notes: "",
        workoutExercises: []
      };
      if (exercises && exercises.length > 0) {

        for (const ex of exercises) {
          const newItem: WorkoutExerciseResponse = {
            workoutExerciseId: 0,         // new entry placeholder
            exerciseId: ex.exerciseId,    // REQUIRED
            reps: 0,                      // default values (can be edited later)
            sets: 0,
            weight: 0,
            exercise: ex                  // full exercise object
          };

          this.workout?.workoutExercises.push(newItem);
        }
      }
      this.exerciseService.resetSelectedExercises(); // clear it
    });
  }

  onCreate(data: WorkoutRequestDTO): void {
    this.workoutService.createWorkout(data).subscribe({
    next: () => {
      this.snackBar.open('Workout created successfully!', "Close", {duration: 3000});
      this.router.navigateByUrl("view-workouts")
    },
    error: err => {
      console.error(err);
      this.snackBar.open('Failed to create workout.', "Close", {duration: 3000});
    }
  });
  }

  onCancel(): void{
    this.router.navigateByUrl("view-workouts")
  }
}