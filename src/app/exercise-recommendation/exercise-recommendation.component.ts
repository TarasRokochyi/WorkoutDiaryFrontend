import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ExerciseService } from '../shared/services/exercise.service';
import { ExerciseRecommendation } from '../_interfaces/exercise-recommendation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-recommendation',
  standalone: false,
  templateUrl: './exercise-recommendation.component.html',
  styleUrl: './exercise-recommendation.component.css'
})
export class ExerciseRecommendationComponent {
  form: FormGroup;
  selectedFile?: File;
  previewSrc?: string | ArrayBuffer | null;
  loading = false;
  error?: string;
  recommendations: ExerciseRecommendation[] = [];
  equipments: string[] = [];

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private router: Router
  ) {
    this.form = this.fb.group({});
  }

  onFileSelected(event: Event) {
    this.error = undefined;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = undefined;
      this.previewSrc = undefined;
      return;
    }
    const file = input.files[0];
    this.setFile(file);
  }

  setFile(file: File) {
    // basic client-side validations
    if (!file.type.startsWith('image/')) {
      this.error = 'Please select an image file.';
      return;
    }
    this.selectedFile = file;

    // create preview
    const reader = new FileReader();
    reader.onload = () => this.previewSrc = reader.result;
    reader.readAsDataURL(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.error = undefined;
    if (event.dataTransfer && event.dataTransfer.files.length) {
      const file = event.dataTransfer.files[0];
      this.setFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  upload() {
    this.error = undefined;
    if (!this.selectedFile) {
      this.error = 'No image selected.';
      return;
    }

    this.loading = true;
    this.exerciseService.uploadImage(this.selectedFile)
      .subscribe({
        next: (res) => {
          this.recommendations = res;
          this.loading = false;

          this.equipments = Array.from(new Map(this.recommendations.map(x => [x.equipmentName, x.equipmentName])).values())
        },
        error: (err) => {
          this.error = err?.error?.message || 'Upload failed';
          this.loading = false;
        }
      });
  }

  // Flattens list of ExerciseRecommendation into array of { equipment, exercise }
  // getFlattenedSuggestions(): ExerciseRecommendation[] {
  //   if (!this.result) return [];

  //   const out: Array<{ equipment: string, exercise: string }> = [];

  //   for (const rec of this.result) {
  //     const equipmentName = rec.equipmentName;
  //     const exercises = rec.exercises ?? [];

  //     for (const ex of exercises) {
  //       out.push({
  //         equipment: equipmentName,
  //         exercise: ex.name
  //       });
  //     }
  //   }

  //   return out;
  // }

  // Hook: implement adding an exercise to user's workout via your existing API
  addExerciseToWorkout(exercise: ExerciseRecommendation) {
    debugger
    this.exerciseService.setSelectedExercises([exercise.exercise]);
    this.router.navigate(['/create-workout']);
  }

  selectedExercises: ExerciseRecommendation[] = [];
  selectAllChecked = false;

  isSelected(item: ExerciseRecommendation) {
    return this.selectedExercises.some(
      x => x.exercise.name === item.exercise.name && x.equipmentName === item.equipmentName
    );
  }

  toggleExerciseSelection(item: ExerciseRecommendation) {
    if (this.isSelected(item)) {
      this.selectedExercises = this.selectedExercises.filter(
        x => !(x.exercise.name === item.exercise.name && x.equipmentName === item.equipmentName)
      );
    } else {
      this.selectedExercises.push(item);
    }
  }

  toggleSelectAll() {
    if (this.selectAllChecked) {
      this.selectedExercises = this.recommendations;
    } else {
      this.selectedExercises = [];
    }
  }

  addSelectedExercises() {


    const exercises = Array.from(
      new Map(this.selectedExercises.map(x => [x.exercise.exerciseId, x.exercise])).values()
    );

    debugger


    this.exerciseService.setSelectedExercises(exercises);
    this.router.navigate(['/create-workout']);
  }


}
