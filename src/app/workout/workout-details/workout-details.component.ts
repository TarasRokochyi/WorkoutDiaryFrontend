import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../shared/services/workout.service';
import { Component, OnInit } from '@angular/core';
import { Workout, WorkoutRequestDTO } from '../../_interfaces/workout.model';
import { WorkoutExerciseResponse } from '../../_interfaces/workout-exercise.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workout-details',
  standalone: false,
  templateUrl: './workout-details.component.html',
  styleUrl: './workout-details.component.css'
})

export class WorkoutDetailsComponent implements OnInit {

  workout?: Workout;
  loading = true;
  editing = false;

  constructor(
    private route: ActivatedRoute,
    private workoutService: WorkoutService,
    private snackBar: MatSnackBar,
    private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.workoutService.getWorkoutById(id).subscribe({
      next: (data) => {
        this.workout = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Workout not found', err);
        this.loading = false;
      },
    });
  }

  toggleEdit(): void {
    this.editing = !this.editing;
  }

  onSave(data: Workout): void {
    if (!this.workout) return;
    
    debugger;
    // here data: Workout, but it maps to WorkoutRequestDTO automatically
    this.workoutService.updateWorkout(data.workoutId, data).subscribe({
      next: (updated) => {
        this.workout = updated;
        this.editing = false;
        this.snackBar.open('Workout updated successfully!', "Close", {duration: 3000});
      },
      error: (err) => {
        console.error('Error updating workout', err);
        this.snackBar.open('Failed to update workout.', "Close", {duration: 3000});
      }
    });
  }

  getExerciseSummary(ex: WorkoutExerciseResponse): { label: string; value: string } | null {
    switch (ex.exercise.category) {
      case 'Strength':
        if (ex.sets != null && ex.reps != null && ex.weight != null) {
          const volume = ex.sets * ex.reps * ex.weight;
          return { label: 'Volume', value: `${volume.toLocaleString()} kg` };
        }
        return null;
      case 'Cardio':
        if (ex.distance != null && ex.duration != null && ex.distance > 0) {
          const pace = ex.duration / ex.distance;
          const mins = Math.floor(pace);
          const secs = Math.round((pace - mins) * 60);
          return { label: 'Pace', value: `${mins}:${secs.toString().padStart(2, '0')} /km` };
        }
        return null;
      case 'Static':
        if (ex.sets != null && ex.duration != null) {
          return { label: 'Total', value: `${ex.sets * ex.duration} min` };
        }
        return null;
      default:
        return null;
    }
  }

  getMuscleGroups(ex: WorkoutExerciseResponse): string[] {
    return ex.exercise.muscleGroups
      ? ex.exercise.muscleGroups.split(',').map(s => s.trim()).filter(Boolean)
      : [];
  }

  onDelete(): void {
    const confirmed = confirm('Are you sure you want to delete this workout?');
    if (!confirmed || !this.workout) return;

    this.workoutService.deleteWorkout(this.workout.workoutId).subscribe({
      next: () => {
        this.snackBar.open('Workout deleted successfully!', 'Close', {duration: 3000});
        this.router.navigate(['view-workouts']);
      },
      error: err => {
        this.snackBar.open('Failed to delete workout', "Close", {duration: 3000})
        console.error('Failed to delete workout', err);
      }
    });
  }


}

