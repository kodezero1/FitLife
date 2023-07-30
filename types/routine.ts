import { Workout } from ".";

export interface NewRoutine {
  creatorName: string;
  name: string;
  creator_id: string;
  workoutPlan: { isoDate: string; workout_id: string }[];
}
export interface Routine extends NewRoutine {
  readonly _id: string;
  workoutPlan: { isoDate: string; workout_id: string; workout: Workout }[];
}

export interface RoutineForCalendar {
  [isoDate: string]: { workout_id?: string; workout: Workout };
}
