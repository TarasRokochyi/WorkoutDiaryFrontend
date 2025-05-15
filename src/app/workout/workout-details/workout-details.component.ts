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
  //form!: FormGroup;
  loading = true;
  editing = false;

  constructor(
    private route: ActivatedRoute,
    private workoutService: WorkoutService,
    //private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.workoutService.getWorkoutById(id).subscribe({
      next: (data) => {
        this.workout = data;
        //this.initForm(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Workout not found', err);
        this.loading = false;
      },
    });
  }

  // initForm(workout: WorkoutResponseDTO): void {
  //   this.form = this.fb.group({
  //     name: [workout.name, Validators.required],
  //     date: [new Date(workout.date), Validators.required],
  //     duration: [workout.duration, [Validators.required, Validators.min(1)]],
  //     notes: [workout.notes],
  //   });
  // }

  toggleEdit(): void {
    this.editing = !this.editing;
    //if (this.editing && this.workout) {
    //  this.initForm(this.workout); // re-init to reset form on cancel
    //}
  }

  // onSave(): void {
  //   if (this.form.invalid || !this.workout) return;

  //   const updatedWorkout = {
  //     ...this.workout,
  //     ...this.form.value,
  //   };

  //   this.workoutService.updateWorkout(this.workout.workoutId, updatedWorkout).subscribe({
  //     next: (data) => {
  //       this.workout = data;
  //       this.editing = false;
  //     },
  //     error: (err) => {
  //       console.error('Error updating workout', err);
  //     },
  //   });
  // }

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

