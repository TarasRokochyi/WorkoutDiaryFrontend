import { ActivatedRoute } from '@angular/router';
import { WorkoutService } from '../../shared/services/workout.service';
import { Component, OnInit } from '@angular/core';
import { WorkoutRequestDTO, WorkoutResponseDTO } from '../../_interfaces/workout.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  ) {}

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

  onSave(data: WorkoutRequestDTO): void {
    debugger
  if (!this.workout) return;

  this.workoutService.updateWorkout(this.workout.workoutId, data).subscribe({
    next: (updated) => {
      this.workout = updated;
      this.editing = false;
      alert('Workout updated successfully!');
    },
    error: (err) => {
      console.error('Error updating workout', err);
      alert('Failed to update workout.');
    }
  });
}

}

