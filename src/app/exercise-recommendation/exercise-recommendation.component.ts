import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../shared/services/exercise.service';
import { ExerciseRecommendation } from '../_interfaces/exercise-recommendation.model';
import { Router } from '@angular/router';

type Mode = 'upload' | 'manual';

@Component({
  selector: 'app-exercise-recommendation',
  standalone: false,
  templateUrl: './exercise-recommendation.component.html',
  styleUrl: './exercise-recommendation.component.css'
})
export class ExerciseRecommendationComponent implements OnInit {
  mode: Mode = 'upload';

  // Upload mode
  selectedFile?: File;
  previewSrc?: string | ArrayBuffer | null;

  // Manual mode
  allEquipmentNames: string[] = [];
  selectedEquipmentNames: string[] = [];
  noEquipmentSelected = false;

  get equipmentChips(): string[] {
    return this.allEquipmentNames.filter(n => n !== 'no equipment');
  }

  // Difficulty
  difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  selectedDifficulty?: string;

  // Shared
  loading = false;
  error?: string;
  recommendations: ExerciseRecommendation[] = [];
  equipments: string[] = [];
  selectedExercises: ExerciseRecommendation[] = [];
  selectAllChecked = false;

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.exerciseService.getEquipmentNames().subscribe({
      next: (names) => this.allEquipmentNames = names,
      error: (err) => console.error('Failed to load equipment', err)
    });
  }

  setMode(mode: Mode): void {
    this.mode = mode;
    this.recommendations = [];
    this.error = undefined;
    this.noEquipmentSelected = false;
    this.selectedEquipmentNames = [];
  }

  // ── Upload mode ──
  onFileSelected(event: Event) {
    this.error = undefined;
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) { this.selectedFile = undefined; this.previewSrc = undefined; return; }
    this.setFile(input.files[0]);
  }

  setFile(file: File) {
    if (!file.type.startsWith('image/')) { this.error = 'Please select an image file.'; return; }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.previewSrc = reader.result;
    reader.readAsDataURL(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.error = undefined;
    if (event.dataTransfer?.files.length) this.setFile(event.dataTransfer.files[0]);
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }

  upload() {
    if (!this.selectedFile) { this.error = 'No image selected.'; return; }
    this.loading = true;
    this.error = undefined;
    this.exerciseService.uploadImageWithDifficulty(this.selectedFile, this.selectedDifficulty).subscribe({
      next: (res) => {
        this.recommendations = res;
        this.equipments = [...new Map(res.map((x: ExerciseRecommendation) => [x.equipmentName, x.equipmentName])).values()] as string[];
        this.loading = false;
      },
      error: (err) => { this.error = err?.error?.message || 'Upload failed'; this.loading = false; }
    });
  }

  // ── Manual mode ──
  toggleEquipment(name: string): void {
    this.noEquipmentSelected = false;
    const idx = this.selectedEquipmentNames.indexOf(name);
    if (idx === -1) this.selectedEquipmentNames.push(name);
    else this.selectedEquipmentNames.splice(idx, 1);
  }

  toggleNoEquipment(): void {
    this.noEquipmentSelected = !this.noEquipmentSelected;
    if (this.noEquipmentSelected) this.selectedEquipmentNames = [];
  }

  isEquipmentSelected(name: string): boolean {
    return this.selectedEquipmentNames.includes(name);
  }

  getManualRecommendations(): void {
    const names = this.noEquipmentSelected ? ['no equipment'] : this.selectedEquipmentNames;
    if (!names.length) { this.error = 'Select equipment or choose No Equipment.'; return; }
    this.loading = true;
    this.error = undefined;
    this.exerciseService.getRecommendationsByEquipmentNames(names, this.selectedDifficulty).subscribe({
      next: (res) => {
        this.recommendations = res;
        this.equipments = this.selectedEquipmentNames;
        this.loading = false;
      },
      error: (err) => { this.error = err?.error?.message || 'Failed to get recommendations'; this.loading = false; }
    });
  }

  // ── Results ──
  isSelected(item: ExerciseRecommendation): boolean {
    return this.selectedExercises.some(x => x.exercise.name === item.exercise.name && x.equipmentName === item.equipmentName);
  }

  toggleExerciseSelection(item: ExerciseRecommendation): void {
    if (this.isSelected(item)) this.selectedExercises = this.selectedExercises.filter(x => !(x.exercise.name === item.exercise.name && x.equipmentName === item.equipmentName));
    else this.selectedExercises.push(item);
  }

  toggleSelectAll(): void {
    this.selectedExercises = this.selectAllChecked ? [...this.recommendations] : [];
  }

  addExerciseToWorkout(exercise: ExerciseRecommendation): void {
    this.exerciseService.setSelectedExercises([exercise.exercise]);
    this.router.navigate(['/create-workout']);
  }

  addSelectedExercises(): void {
    const exercises = [...new Map(this.selectedExercises.map(x => [x.exercise.exerciseId, x.exercise])).values()];
    this.exerciseService.setSelectedExercises(exercises);
    this.router.navigate(['/create-workout']);
  }
}
