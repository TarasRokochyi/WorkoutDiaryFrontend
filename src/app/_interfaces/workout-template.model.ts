import { WorkoutExerciseRequestDTO, WorkoutExerciseResponse } from "./workout-exercise.model";

export interface WorkoutTemplateRequestDTO {
  name?: string | null;
  duration?: number | null;
  notes?: string | null;
  workoutExercises: WorkoutExerciseRequestDTO[];
}

export interface WorkoutTemplate {
  templateId: number;
  name: string;
  duration?: number;
  notes?: string;
  workoutExercises: WorkoutExerciseResponse[];
}
