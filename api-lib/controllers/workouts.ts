import { QueryClient, useMutation, useQuery } from "react-query";
import { Updater } from "react-query/types/core/utils";
import { NewWorkout, User, Workout } from "../../types";
import { getSortedWorkoutLogDateArray } from "../../utils";
import {
  deleteWorkout,
  getAllPublicWorkouts,
  getWorkoutsByCreatorId,
  getWorkoutsFromIdArray,
  postNewWorkout,
  updateExistingWorkout,
} from "../fetchers";

const CreatedWorkouts = "created-workouts";
const RecentWorkouts = "recent-workouts";
const SavedWorkouts = "saved-workouts";
const PublicWorkouts = "public-workouts";

const setQueriesData = (
  queryClient: QueryClient,
  queryKey: string | string[],
  updater: Updater<Workout[] | undefined, Workout[]>
) => {
  const query = (key: string) => queryClient.setQueriesData(key, updater);
  if (Array.isArray(queryKey)) queryKey.forEach((key) => query(key));
  else query(queryKey);
};

/**
 *
 * @param user
 * @returns
 */
export const getUserMadeWorkouts = (user: User | undefined) =>
  useQuery([CreatedWorkouts, user?._id], () => getWorkoutsByCreatorId(user?._id), {
    enabled: !!user?._id,
  });

/**
 *
 * @param user
 * @returns
 */
export const getRecentWorkouts = (user: User | undefined) => {
  const dates = getSortedWorkoutLogDateArray(user?.workoutLog || {});
  const uniqueRecentIds = [
    ...new Set(
      dates
        .map((date) => user?.workoutLog[date].workout_id || "")
        .filter((id) => id)
        .reverse()
    ),
  ];

  return useQuery(RecentWorkouts, () => getWorkoutsFromIdArray(uniqueRecentIds || []), {
    enabled: !!user?._id,
  });
};

/**
 *
 * @param user
 * @returns
 */
export const getSavedWorkouts = (user: User | undefined) =>
  useQuery(
    SavedWorkouts,
    () => getWorkoutsFromIdArray([...(user?.savedWorkouts || [])].reverse()),
    {
      enabled: !!user?._id,
      initialData: [] as Workout[],
    }
  );
export const getPublicWorkouts = () => useQuery("public-workouts", getAllPublicWorkouts);

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useUpdateWorkout = (
  queryClient: QueryClient,
  options?: { onSuccess: (workout: Workout) => void }
) =>
  useMutation(({ workout }: { workout: Workout }) => updateExistingWorkout(workout), {
    onSuccess: (workout) => {
      if (!workout) return;

      options?.onSuccess && options.onSuccess(workout);
      setQueriesData(
        queryClient,
        [SavedWorkouts, CreatedWorkouts, RecentWorkouts],
        (oldQueryData) => [
          ...(oldQueryData || []).map((w) => (w._id === workout._id ? workout : w)),
        ]
      );
    },
  });

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useCreateWorkout = (
  queryClient: QueryClient,
  options?: { onSuccess: (workout: Workout) => void }
) =>
  useMutation(({ workout }: { workout: NewWorkout }) => postNewWorkout(workout), {
    onSuccess: (workout) => {
      if (!workout) return;

      options?.onSuccess && options.onSuccess(workout);
      setQueriesData(queryClient, CreatedWorkouts, (oldQueryData) => [
        workout,
        ...(oldQueryData || []),
      ]);
    },
  });

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useDeleteWorkout = (
  queryClient: QueryClient,
  options?: { onSuccess: (workoutId: string) => void }
) =>
  useMutation(({ workoutId }: { workoutId: string }) => deleteWorkout(workoutId), {
    onSuccess: (workoutId) => {
      if (!workoutId) return;

      options?.onSuccess && options.onSuccess(workoutId);
      setQueriesData(
        queryClient,
        [CreatedWorkouts, SavedWorkouts, RecentWorkouts],
        (oldQueryData) => [...(oldQueryData || []).filter((w) => w._id !== workoutId)]
      );
    },
  });
