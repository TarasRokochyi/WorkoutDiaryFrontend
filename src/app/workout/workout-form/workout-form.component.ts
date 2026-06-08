import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Workout } from '../../_interfaces/workout.model';
import { Exercise } from '../../_interfaces/exercise.model';
import { ExerciseService } from '../../shared/services/exercise.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkoutTemplateService } from '../../shared/services/workout-template.service';
import { WorkoutTemplate } from '../../_interfaces/workout-template.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateCustomExerciseComponent } from '../../create-custom-exercise/create-custom-exercise.component';

@Component({
  selector: 'app-workout-form',
  standalone: false,
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.css'
})
export class WorkoutFormComponent implements OnInit {
  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  @Input() initialData?: Workout;
  @Input() submitLabel: string;
  @Output() submitWorkout = new EventEmitter<Workout>();
  @Output() cancelWorkout = new EventEmitter<Workout>();

  allTemplates: WorkoutTemplate[] = [];
  allExercises: Exercise[] = [];
  exerciseCategories: string[] = [];

  workoutForm!: FormGroup;
  filteredExercises: Exercise[][] = [];

  constructor(private fb: FormBuilder,
              private exerciseService: ExerciseService,
              private workoutTemplateService: WorkoutTemplateService,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.workoutTemplateService.getWorkoutTemplates().subscribe({
      next: (data) => { this.allTemplates = data; },
      error: (err) => { console.log(err); }
    });

    this.workoutForm = this.fb.group({
      name: [this.initialData?.name || '', Validators.required],
      dateOnly: [this.initialData?.date ? new Date(this.initialData.date) : new Date(), Validators.required],
      timeOnly: [this.initialData?.date ? new Date(this.initialData.date) : new Date(), Validators.required],
      duration: [this.initialData?.duration || '', Validators.required],
      notes: [this.initialData?.notes || ''],
      template: [this.allTemplates],
      workoutExercises: this.fb.array([]),
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      const date = params['date'];
      if (date) {
        const dateWithTime = new Date(date);
        this.workoutForm.get('dateOnly')?.setValue(dateWithTime);
        this.workoutForm.get('timeOnly')?.setValue(dateWithTime);
      }
    });

    firstValueFrom(this.exerciseService.getExercises()).then(data => {
      this.allExercises = data;
      this.exerciseCategories = [...new Set(this.allExercises.map(item => item.category))];

      if (this.initialData?.workoutExercises?.length) {
        this.initialData.workoutExercises.forEach((ex, index) => {
          this.addExercise(ex);
          this.onCategoryChange(index);
        });
      } else {
        this.addExercise();
      }
    });
  }

  get exercises(): FormArray {
    return this.workoutForm.get('workoutExercises') as FormArray;
  }

  addExercise(exercise?: any): void {
    const group = this.fb.group({
      category: [exercise?.exercise.category || '', Validators.required],
      exerciseId: [exercise?.exerciseId || '', Validators.required],
      sets: [exercise?.sets || null],
      reps: [exercise?.reps || null],
      weight: [exercise?.weight || null],
      distance: [exercise?.distance || null],
      duration: [exercise?.duration || null],
    });
    this.exercises.push(group);
    this.filteredExercises.push(this.allExercises);
  }

  removeExercise(index: number): void {
    this.exercises.removeAt(index);
    this.filteredExercises.splice(index, 1);
  }

  onCategoryChange(index: number): void {
    const selectedCategory = this.exercises.at(index).get('category')?.value;
    this.filteredExercises[index] = this.allExercises.filter((ex) => ex.category === selectedCategory);
  }

  onExerciseChange(index: number): void {
    const exerciseId = this.exercises.at(index).get('exerciseId')?.value;
    const exercise = this.allExercises.find(arr => arr.exerciseId == exerciseId);
    this.exercises.at(index).get('category')?.setValue(exercise?.category);
  }

  onCreateExercise(): void {
    const ref = this.dialog.open(CreateCustomExerciseComponent, {
      width: '480px',
      panelClass: 'custom-exercise-dialog'
    });
    ref.afterClosed().subscribe((created: Exercise | null) => {
      if (created) {
        this.allExercises.push(created);
        if (!this.exerciseCategories.includes(created.category)) {
          this.exerciseCategories.push(created.category);
        }
        this.filteredExercises = this.filteredExercises.map((_, i) => {
          const selected = this.exercises.at(i).get('category')?.value;
          return selected ? this.allExercises.filter(e => e.category === selected) : [...this.allExercises];
        });
      }
    });
  }

  onChooseTemplate(id: number): void {
    const template = this.allTemplates.find(t => t.templateId == id);
    const currentDate = this.workoutForm.get('dateOnly')?.value ?? new Date();
    const currentTime = this.workoutForm.get('timeOnly')?.value ?? new Date();
    this.workoutForm = this.fb.group({
      name: [template?.name || '', Validators.required],
      dateOnly: [currentDate, Validators.required],
      timeOnly: [currentTime, Validators.required],
      duration: [template?.duration || '', Validators.required],
      notes: [template?.notes || ''],
      template: [this.allTemplates],
      workoutExercises: this.fb.array([]),
    });
    if (template?.workoutExercises?.length) {
      template.workoutExercises.forEach((ex, index) => {
        this.addExercise(ex);
        this.onCategoryChange(index);
      });
    } else {
      this.addExercise();
    }
  }

  onSaveTemplate(): void {
    if (this.workoutForm.valid) {
      const { dateOnly, timeOnly, ...data } = this.workoutForm.value;
      this.workoutTemplateService.createWorkoutTemplate(data).subscribe({
        next: () => {
          this.snackBar.open('Workout template saved successfully!', 'Close', { duration: 3000 });
          this.allTemplates.push(data);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Failed to save workout template.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.workoutForm.valid) {
      const { dateOnly, timeOnly, template, ...rest } = this.workoutForm.value;
      const combinedDate = new Date(dateOnly);
      combinedDate.setHours(timeOnly.getHours());
      combinedDate.setMinutes(timeOnly.getMinutes());
      const payload: Workout = {
        ...rest,
        date: combinedDate.toISOString(),
        workoutId: this.initialData?.workoutId
      };
      this.submitWorkout.emit(payload);
    }
  }

  onCancel(): void {
    this.workoutForm.reset();
    this.cancelWorkout.emit();
  }
}
