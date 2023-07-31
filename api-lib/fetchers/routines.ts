import { Routine, NewRoutine } from "../../types";
import { getHeaderToken } from "../auth/token";

export const getRoutinesFromCreatorId = async (creator_id?: string) => {
  if (!creator_id) return;

  try {
    const res = await fetch(`/api/routines/?creator_id=${creator_id}`);

    const routines: Routine[] = await res.json();

    return routines;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getRoutineFromId = async (routine_id: string): Promise<Routine | false> => {
  try {
    const res = await fetch(`/api/routines/${routine_id}`);

    const routineData = await res.json();

    return routineData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const postNewRoutine = async (newRoutine: NewRoutine): Promise<Routine | false> => {
  try {
    const res = await fetch(`/api/routines`, {
      method: "POST",
      body: JSON.stringify({ newRoutine }),
      headers: { token: getHeaderToken() },
    });

    const { routine }: { routine: Routine } = await res.json();

    return routine || false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const updateRoutine = async (updatedRoutine: Routine) => {
  try {
    const res = await fetch(`/api/routines/${updatedRoutine._id}`, {
      method: "PUT",
      body: JSON.stringify({ updatedRoutine }),
      headers: { token: getHeaderToken() },
    });

    return res.status === 204 ? updatedRoutine : false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const deleteRoutine = async (routine_id: string) => {
  try {
    const res = await fetch(`/api/routines/${routine_id}`, {
      method: "DELETE",
      headers: { token: getHeaderToken() },
    });

    return res.status === 204 ? routine_id : false;
  } catch (e) {
    console.log(e);
    return false;
  }
};
