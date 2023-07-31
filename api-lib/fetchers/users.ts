import dayjs from "dayjs";
import { User, ShortUser, WorkoutLog } from "../../types";

export const getUserFromUsername = async (username: string) => {
  try {
    const res = await fetch(`/api/users/username?username=${username}`);
    const userData: User = await res.json();
    return userData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getUserWorkoutLog = async (
  user_id: string,
  startDate: dayjs.Dayjs = dayjs("1970"), // default to 1970
  endDate: dayjs.Dayjs = dayjs() // default to now
) => {
  try {
    const res = await fetch(
      `/api/users/${user_id}?getUserWorkoutLog=1&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    const log: WorkoutLog = await res.json();
    return log;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Multiple
export const getUsersFromIdArr = async (idArr: string[]) => {
  if (!idArr.length) return [];

  try {
    const res = await fetch(`/api/users/queryMultiple`, {
      method: "POST",
      body: JSON.stringify({ idArr }),
    });

    const users: ShortUser[] = await res.json();
    return users;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// Queries
export const queryShortUsersByUsername = async (query: string) => {
  try {
    const res = await fetch(`/api/users/searchUsername?query=${query}`);

    const users: ShortUser[] = await res.json();
    return users;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const isUserActive = async (user_id: string) => {
  try {
    const res = await fetch(`/api/users/activeUsers?user_id=${user_id}`);

    const user: { active: boolean } = await res.json();
    return user.active;
  } catch (e) {
    console.log(e);
    return false;
  }
};
