import { Routine, ShortUser } from ".";

export interface NewTeam {
  teamName: string;
  members: string[];
  dateCreated: string;
  creatorName: string;
  creator_id: string;
  trainers: ShortUser[];
  routine_id: string;
}
export interface Team extends NewTeam {
  readonly _id: string;
  routine: Routine;
}
