import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../shared/services/workout.service';
import { Component, OnInit } from '@angular/core';
import { WorkoutRequestDTO, WorkoutResponseDTO } from '../../_interfaces/workout.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workout-details',
  standalone: false,
  templateUrl: './workout-details.component.html',
  styleUrl: './workout-details.component.css'
})

export class WorkoutDetailsComponent implements OnInit {

  workout?: WorkoutResponseDTO;
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
        debugger
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

  onSave(data: WorkoutRequestDTO): void {
    debugger
    if (!this.workout) return;

    this.workoutService.updateWorkout(this.workout.workoutId, data).subscribe({
      next: (updated) => {
        debugger
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

