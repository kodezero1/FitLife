import { Exercise, NewExercise } from ".";

export interface NewWorkout {
  creatorName: string;
  name: string;
  isPublic: boolean;
  numLogged: number;
  creator_id: string;
  exercises: {
    exercise_id: string;
    metric: Exercise["metric"];
    sets: Set[];
    note?: string;
    exercise?: Exercise;
  }[];
  muscleGroups: [
    NewExercise["muscleGroup"],
    {
      count: number;
      exerciseIds: string[];
    }
  ][];
  date_created: string;
}
export interface Workout extends NewWorkout {
  readonly _id: string;
}

// Set
export type Set = WeightSet | TimeSet | DistanceSet;

export interface WeightSet {
  reps: number | string;
  weight: number | string;
  type: "1" | "W" | "D" | "F";
}
export interface TimeSet {
  duration: number;
  startedAt: number;
  ongoing: boolean;
  type: "1" | "W" | "D" | "F";
}
export interface DistanceSet {
  distance: number;
  unit: string;
  type: "1" | "W" | "D" | "F";
}
