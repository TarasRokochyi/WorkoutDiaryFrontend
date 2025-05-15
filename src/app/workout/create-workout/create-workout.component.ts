import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { WorkoutService } from '../../shared/services/workout.service';
import { ExerciseService } from '../../shared/services/exercise.service';
import { WorkoutRequestDTO } from '../../_interfaces/workout.model';
import { Exercise } from '../../_interfaces/exercise.model';
import { WorkoutExerciseRequestDTO } from '../../_interfaces/workout-exercise.model';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-workout',
  standalone: false,
  templateUrl: './create-workout.component.html',
  styleUrls: ['./create-workout.component.css']
})
export class WorkoutCreateComponent implements OnInit {
  workoutForm!: FormGroup;

  //exerciseCategories: string[] = [];

  //allExercises: Exercise[] = [];

  // Store filtered list per exercise row
  //filteredExercises: Exercise[][] = [];

  constructor(private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService, 
    private router: Router) 
    {
      //this.workoutForm = this.fb.group({
      //  name: ['', Validators.required],
      //  date: ['', Validators.required],
      //  duration: [null, Validators.required],
      //  notes: [''],
      //  workoutExercises: this.fb.array([])
      //});
    }

  async ngOnInit(): Promise<void> {
    
    //this.allExercises = await firstValueFrom(this.exerciseService.getExercises())

    //this.exerciseCategories = [...new Set(this.allExercises.map(item => item.category))];


    //this.addExercise(); // start with one exercise by default
  }

  //get exercises(): FormArray {
  //  return this.workoutForm.get('workoutExercises') as FormArray;
  //}

  //addExercise(): void {
  //  const exerciseGroup = this.fb.group({
  //    category: [''],
  //    exerciseId: [null],
  //    type: [''],
  //    sets: [null],
  //    reps: [null],
  //    weight: [null],
  //    distance: [null],
  //    duration: [null],
  //  });

  //  this.exercises.push(exerciseGroup);
  //  this.filteredExercises.push(this.allExercises); // init empty filtered list
  //}

  //removeExercise(index: number): void {
  //  this.exercises.removeAt(index);
  //}

  onCreate(data: WorkoutRequestDTO): void {
    // if (this.workoutForm.valid) {
    //   this.workoutService.createWorkout(this.workoutForm.value as WorkoutRequestDTO).subscribe({
    //     next: () => {
    //       alert('Workout created successfully!');
    //       this.workoutForm.reset();
    //       this.exercises.clear();
    //       this.addExercise();
    //     },
    //     error: err => {
    //       console.error(err);
    //       alert('Failed to create workout.');
    //     }
    //   });
    // }
    this.workoutService.createWorkout(data).subscribe({
    next: () => {
      alert('Workout created successfully!');
    },
    error: err => {
      console.error(err);
      alert('Failed to create workout.');
    }
  });
  }

  onCancel(): void{
    this.router.navigateByUrl("view-workouts")
  }

  //onCreateExercise(): void {
  //this.router.navigate(['/exercises/create']); // Assuming you have this route
  //}

  //onCreateTemplate(): void {
  //this.router.navigate(['/template/create']); // Assuming you have this route
  //}

  //onCategoryChange(index: number): void {
  //  const selectedCategory = this.exercises.at(index).get('category')?.value;
  //  this.filteredExercises[index] = this.allExercises.filter(ex => ex.category === selectedCategory);
  //}


}