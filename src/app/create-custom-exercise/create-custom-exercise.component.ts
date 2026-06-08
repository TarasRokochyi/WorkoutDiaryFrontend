import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ExerciseService } from '../shared/services/exercise.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Exercise } from '../_interfaces/exercise.model';

@Component({
  selector: 'app-create-custom-exercise',
  standalone: false,
  templateUrl: './create-custom-exercise.component.html',
  styleUrl: './create-custom-exercise.component.css'
})
export class CreateCustomExerciseComponent implements OnInit {
  exerciseForm!: FormGroup;
  categories: string[] = ['Strength', 'Cardio', 'Static'];

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private dialogRef: MatDialogRef<CreateCustomExerciseComponent>,
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
        next: (created: Exercise) => {
          this.snackBar.open('Exercise created!', 'Close', { duration: 3000 });
          this.dialogRef.close(created);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Failed to create exercise.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
