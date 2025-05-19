import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { WorkoutService } from '../../shared/services/workout.service';
import { ExerciseService } from '../../shared/services/exercise.service';
import { WorkoutRequestDTO } from '../../_interfaces/workout.model';
import { Exercise } from '../../_interfaces/exercise.model';
import { WorkoutExerciseRequestDTO } from '../../_interfaces/workout-exercise.model';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-workout',
  standalone: false,
  templateUrl: './create-workout.component.html',
  styleUrls: ['./create-workout.component.css']
})
export class WorkoutCreateComponent implements OnInit {
  workoutForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService, 
    private router: Router,
    private snackBar: MatSnackBar) { }

  async ngOnInit(): Promise<void> {
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