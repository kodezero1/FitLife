import { QueryClient, useMutation, useQuery } from "react-query";
import { Updater } from "react-query/types/core/utils";
import { Routine, User } from "../../types";
import {
  deleteRoutine,
  getRoutinesFromCreatorId,
  postNewRoutine,
  updateRoutine,
} from "../fetchers";

const UserRoutines = "user-routines";

const setQueriesData = (
  queryClient: QueryClient,
  queryKey: string | string[],
  updater: Updater<Routine[] | undefined, Routine[]>
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
export const useUserRoutines = (user: User | undefined) =>
  useQuery(UserRoutines, () => getRoutinesFromCreatorId(user?._id), {
    enabled: !!user?._id,
    initialData: [] as Routine[],
  });

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useCreateRoutine = (
  queryClient: QueryClient,
  options?: { onSuccess: (routine: Routine) => void }
) =>
  useMutation(
    ({ routine, user }: { routine: Routine; user: User }) => {
      const { _id, ...newRoutine } = routine;
      newRoutine.creator_id = user._id;
      newRoutine.creatorName = user.username;
      newRoutine.name = routine.name || "New Routine";

      return postNewRoutine(newRoutine);
    },
    {
      onSuccess: (routine) => {
        if (!routine) return;

        options?.onSuccess && options.onSuccess(routine);
        setQueriesData(queryClient, UserRoutines, (oldQueryData) => [
          routine,
          ...(oldQueryData || []),
        ]);
      },
    }
  );

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useUpdateRoutine = (
  queryClient: QueryClient,
  options?: { onSuccess: (routine: Routine) => void }
) =>
  useMutation(({ routine }: { routine: Routine }) => updateRoutine(routine), {
    onSuccess: (routine) => {
      if (!routine) return;

      options?.onSuccess && options.onSuccess(routine);
      setQueriesData(queryClient, UserRoutines, (oldQueryData) => [
        ...(oldQueryData || []).map((r) => (r._id === routine._id ? routine : r)),
      ]);
    },
  });

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useDeleteRoutine = (
  queryClient: QueryClient,
  options?: { onSuccess: (routineId: string) => void }
) =>
  useMutation(({ routineId }: { routineId: string }) => deleteRoutine(routineId), {
    onSuccess: (deletedId) => {
      if (!deletedId) return;

      options?.onSuccess && options.onSuccess(deletedId);
      setQueriesData(queryClient, UserRoutines, (oldQueryData) => [
        ...(oldQueryData || []).filter((ex) => ex._id !== deletedId),
      ]);
    },
  });
