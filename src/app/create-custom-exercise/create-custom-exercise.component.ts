import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService } from '../shared/services/exercise.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-custom-exercise',
  standalone: false,
  templateUrl: './create-custom-exercise.component.html',
  styleUrl: './create-custom-exercise.component.css'
})
export class CreateCustomExerciseComponent implements OnInit {
  exerciseForm!: FormGroup;
  categories: string[] = ['Strength', 'Cardio', 'Flexibility', 'Balance'];


  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.exerciseForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      muscleGroups: [''],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.exerciseForm.valid) {
      this.exerciseService.createExercise(this.exerciseForm.value).subscribe({
        next: () => {
          this.snackBar.open('Exercise created successfully!', "Close", {duration: 3000});
          this.router.navigate(['view-workouts']);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Failed to create exercise.', "Close", {duration: 3000});
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['view-workouts']);
  }
}
