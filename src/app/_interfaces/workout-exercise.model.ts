export interface WorkoutExerciseRequestDTO {
  // workoutId will likely be set by the backend or when the parent Workout is saved.
  // For the form, you might not need it directly if exercises are part of the Workout payload.
  exerciseId?: number | null;
  type?: string | null; // e.g., 'Strength', 'Cardio'
  sets?: number | null;
  reps?: number | null;
  weight?: number | null;
  distance?: number | null;
  duration?: number | null; // Duration for this specific exercise
  notes?: string | null;
}

export interface WorkoutExerciseResponse extends WorkoutExerciseRequestDTO {
  id: number;
}