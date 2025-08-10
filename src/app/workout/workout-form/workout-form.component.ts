import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { WorkoutRequestDTO } from '../../_interfaces/workout.model';
import { Exercise } from '../../_interfaces/exercise.model';
import { ExerciseService } from '../../shared/services/exercise.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-form',
  standalone: false,
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.css'
})
export class WorkoutFormComponent implements OnInit {
  @Input() initialData?: WorkoutRequestDTO;
  @Input() submitLabel: string;
  @Output() submitWorkout = new EventEmitter<WorkoutRequestDTO>();
  @Output() cancelWorkout = new EventEmitter<WorkoutRequestDTO>();

  allExercises: Exercise[] = [];
  exerciseCategories: string[] = [];

  workoutForm!: FormGroup;
  filteredExercises: Exercise[][] = [];

  constructor(private fb: FormBuilder, private exerciseService: ExerciseService, private router: Router) { }

  async ngOnInit(): Promise<void> {

    this.workoutForm = this.fb.group({
      name: [this.initialData?.name || '', Validators.required],
      dateOnly: [this.initialData?.date ? new Date(this.initialData.date) : new Date(), Validators.required],
      timeOnly: [this.initialData?.date ? new Date(this.initialData.date) : new Date(), Validators.required],
      duration: [this.initialData?.duration || '', Validators.required],
      notes: [this.initialData?.notes || ''],
      workoutExercises: this.fb.array([]),
    });

    this.allExercises = await firstValueFrom(this.exerciseService.getExercises())

    this.exerciseCategories = [...new Set(this.allExercises.map(item => item.category))];

    if (this.initialData?.workoutExercises?.length) {
      this.initialData.workoutExercises.forEach((ex, index) => {
        this.addExercise(ex)
        this.onCategoryChange(index)
      });
    } else {
      this.addExercise();
    }
  }

  get exercises(): FormArray {
    return this.workoutForm.get('workoutExercises') as FormArray;
  }

  addExercise(exercise?: any): void {
    const group = this.fb.group({
      category: [exercise?.exercise.category || '', Validators.required],
      exerciseId: [exercise?.exerciseId || null, Validators.required],
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

  onCreateExercise(): void {
  this.router.navigate(['/exercises/create']);
  }

  onCreateTemplate(): void {
  this.router.navigate(['/template/create']);
  }

  onSubmit(): void {

    if (this.workoutForm.valid) {
    const { dateOnly, timeOnly, ...rest } = this.workoutForm.value;
    debugger
    const hours = timeOnly.getHours()
    const minutes = timeOnly.getMinutes()
    const combinedDate = new Date(dateOnly);
    combinedDate.setHours(hours);
    combinedDate.setMinutes(minutes);

    const payload = {
      ...rest,
      date: combinedDate.toISOString(),  // send ISO string with timezone
    };

    this.submitWorkout.emit(payload);
  }
  }

  onCancel(): void {
    this.workoutForm.reset()
    this.cancelWorkout.emit();
  }
}
