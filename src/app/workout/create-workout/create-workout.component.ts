import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { WorkoutService } from '../../shared/services/workout.service';
import { ExerciseService } from '../../shared/services/exercise.service';
import { WorkoutRequestDTO } from '../../_interfaces/workout.model';
import { Exercise } from '../../_interfaces/exercise.model';
import { WorkoutExerciseRequestDTO } from '../../_interfaces/workout-exercise.model';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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
    private router: Router) { }

  async ngOnInit(): Promise<void> {
  }

  onCreate(data: WorkoutRequestDTO): void {
    this.workoutService.createWorkout(data).subscribe({
    next: () => {
      alert('Workout created successfully!');
    },
    error: err => {
      console.error(err);
      alert('Failed to create workout.');
    }
  });
  }

  onCancel(): void{
    this.router.navigateByUrl("view-workouts")
  }
}