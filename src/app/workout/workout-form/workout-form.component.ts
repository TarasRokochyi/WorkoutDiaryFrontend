import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Workout, WorkoutRequestDTO } from '../../_interfaces/workout.model';
import { Exercise } from '../../_interfaces/exercise.model';
import { ExerciseService } from '../../shared/services/exercise.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkoutTemplateService } from '../../shared/services/workout-template.service';
import { WorkoutTemplate } from '../../_interfaces/workout-template.model';

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
              private snackBar: MatSnackBar) { }

  ngOnInit() : void {

    this.workoutTemplateService.getWorkoutTemplates().subscribe({
      next: (data) => {
        debugger
        this.allTemplates = data;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.workoutForm = this.fb.group({
      name: [this.initialData?.name || '', Validators.required],
      dateOnly: [this.initialData?.date ? new Date(this.initialData.date) : new Date(), Validators.required],
      timeOnly: [this.initialData?.date ? new Date(this.initialData.date) : new Date(), Validators.required],
      duration: [this.initialData?.duration || '', Validators.required],
      notes: [this.initialData?.notes || ''],
      template: [this.allTemplates],
      workoutExercises: this.fb.array([]),
    });

    firstValueFrom(this.exerciseService.getExercises()).then(data => {
      this.allExercises = data;

      this.exerciseCategories = [...new Set(this.allExercises.map(item => item.category))];

      if (this.initialData?.workoutExercises?.length) {
        this.initialData.workoutExercises.forEach((ex, index) => {
          this.addExercise(ex)
          this.onCategoryChange(index)
        });
      } else {
        this.addExercise();
      }
    })

  }

  filter(index: number): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredExercises[index] = this.allExercises.filter(o => o.name.toLowerCase().includes(filterValue));
  }

  get exercises(): FormArray {
    return this.workoutForm.get('workoutExercises') as FormArray;
  }

  addExercise(exercise?: any): void {
    const group = this.fb.group({
      category: [exercise?.exercise.category || '', Validators.required],
      exerciseName: [exercise?.name || '', Validators.required],
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
    const exerciseName = this.exercises.at(index).get('exerciseName')?.value;
    const exercise = this.allExercises.find(arr => arr.name == exerciseName);
    this.exercises.at(index).get('category')?.setValue(exercise?.category)
  }

  onCreateExercise(): void {
    this.router.navigate(['/exercises/create']);
  }

  onChooseTemplate(id: number): void {
    const template = this.allTemplates.find(t => t.templateId = id);
    
    this.workoutForm = this.fb.group({
      name: [template?.name || '', Validators.required],
      dateOnly: [new Date(), Validators.required],
      timeOnly: [new Date(), Validators.required],
      duration: [template?.duration || '', Validators.required],
      notes: [template?.notes || ''],
      template: [this.allTemplates],
      workoutExercises: this.fb.array([]),
    });

    if (template?.workoutExercises?.length) {
      template.workoutExercises.forEach((ex, index) => {
        this.addExercise(ex)
        this.onCategoryChange(index)
      });
    } else {
      this.addExercise();
    }


  }

  onSaveTemplate(): void {
    if (this.workoutForm.valid){
      const { dateOnly, timeOnly, ...data } = this.workoutForm.value;
      
      this.workoutTemplateService.createWorkoutTemplate(data).subscribe({
        next: () => {
          this.snackBar.open('Workout template saved successfully!', "Close", {duration: 3000});
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Failed to save workout template.', "Close", {duration: 3000});
        }
      });
    }
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

      const payload : Workout = {
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
