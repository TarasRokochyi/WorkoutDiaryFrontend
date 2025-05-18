import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../../shared/services/workout.service';
import { WorkoutResponseDTO } from '../../_interfaces/workout.model';

@Component({
  selector: 'app-view-workouts',
  standalone: false,
  templateUrl: './view-workouts.component.html',
  styleUrl: './view-workouts.component.css'
})

export class ViewWorkoutsComponent implements OnInit {
  workouts: WorkoutResponseDTO[] = [];
  loading = true;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workoutService.getWorkouts().subscribe({
      next: (data) => {
        this.workouts = data.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime(); // Newest first
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching workouts', err);
        this.loading = false;
      }
    });
  }
}
