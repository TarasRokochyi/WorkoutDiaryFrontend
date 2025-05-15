import { Exercise } from "./exercise.model";

export interface WorkoutExerciseRequestDTO {
  // workoutId will likely be set by the backend or when the parent Workout is saved.
  // For the form, you might not need it directly if exercises are part of the Workout payload.
  exerciseId?: number | null;
  sets?: number | null;
  reps?: number | null;
  weight?: number | null;
  distance?: number | null;
  duration?: number | null; // Duration for this specific exercise
}

export interface WorkoutExerciseResponse extends WorkoutExerciseRequestDTO {
  workoutExerciseId: number;
  exercise: Exercise;
}