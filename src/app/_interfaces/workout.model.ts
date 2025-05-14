import { WorkoutExerciseRequestDTO, WorkoutExerciseResponse } from "./workout-exercise.model";

export interface WorkoutRequestDTO {
  name?: string | null;
  date?: Date | null; // Use Date type for easier handling in Angular forms
  duration?: number | null; // Duration in minutes or seconds, be consistent
  notes?: string | null;
  workoutExercises: WorkoutExerciseRequestDTO[];
}

export interface WorkoutResponseDTO {
  id: number;
  name: string;
  date: Date;
  duration?: number;
  notes?: string;
  workoutExercises: WorkoutExerciseResponse[];
}
