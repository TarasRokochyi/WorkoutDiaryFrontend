import { WorkoutExerciseRequestDTO, WorkoutExerciseResponse } from "./workout-exercise.model";

export interface WorkoutRequestDTO {
  name?: string;
  date?: Date | null; // Use Date type for easier handling in Angular forms
  duration?: number | null; // Duration in minutes or seconds, be consistent
  notes?: string | null;
  workoutExercises: WorkoutExerciseRequestDTO[];
}

export interface Workout {
  workoutId: number;
  name: string;
  date: Date;
  duration?: number;
  notes?: string;
  workoutExercises: WorkoutExerciseResponse[];
}

export interface WorkoutShort{
  workoutId: number
  name: string;
  date: Date;
  duration: number;
  notes?: string;
  color?: string;
  startTime: string;
  endTime: string;
}
