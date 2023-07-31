import { QueryClient, useMutation, useQuery } from 'react-query'
import { Updater } from 'react-query/types/core/utils'
import { Exercise, NewExercise, User } from '../../types'
import {
  createExercise,
  deleteExercise,
  getExercisesByUserId,
  getNonDefaultExercises,
  setExercisePublic,
} from '../fetchers'

const NonDefaultExercises = 'non-default-exercises'
const DefaultExercises = 'default-exercises'
const UserExercises = 'user-exercises'

const setQueriesData = (
  queryClient: QueryClient,
  queryKey: string | string[],
  updater: Updater<Exercise[] | undefined, Exercise[]>
) => {
  const query = (key: string) => queryClient.setQueriesData(key, updater)
  if (Array.isArray(queryKey)) queryKey.forEach((key) => query(key))
  else query(queryKey)
}

/**
 *
 * @param queryClient
 * @returns
 */
const invalidateExercises = (queryClient: QueryClient) =>
  queryClient.invalidateQueries([UserExercises, DefaultExercises, NonDefaultExercises])

/**
 *
 * @param user
 * @returns
 */
export const getUserMadeExercises = (user: User | undefined) =>
  useQuery([UserExercises, user?._id], () => getExercisesByUserId(user?._id || ''), {
    enabled: !!user,
  })

/**
 *
 * @param user
 * @returns
 */
export const getInReviewExercises = (user: User | undefined) =>
  useQuery([NonDefaultExercises], getNonDefaultExercises, { enabled: !!user?.isAdmin })

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useCreateExercise = (queryClient: QueryClient, options?: { onSuccess: (exercise: Exercise) => void }) =>
  useMutation(({ newExercise }: { newExercise: NewExercise }) => createExercise(newExercise), {
    onSuccess: (exercise) => {
      if (!exercise) return

      options?.onSuccess && options.onSuccess(exercise)
      setQueriesData(queryClient, [NonDefaultExercises, UserExercises, DefaultExercises], (oldQueryData) => [
        ...(oldQueryData || []),
        exercise,
      ])
    },
  })

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useDeleteExercise = (queryClient: QueryClient, options?: { onSuccess: (deletedId: string) => void }) =>
  useMutation(({ exerciseId }: { exerciseId: string }) => deleteExercise(exerciseId), {
    onSuccess: (deletedId) => {
      if (!deletedId) return

      options?.onSuccess && options.onSuccess(deletedId)
      setQueriesData(queryClient, [NonDefaultExercises, UserExercises], (oldQueryData) => [
        ...(oldQueryData || []).filter((ex) => ex._id !== deletedId),
      ])
    },
  })

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useSetExercisePublic = (queryClient: QueryClient) =>
  useMutation(
    ({ exerciseId, isPublic }: { exerciseId: string; isPublic: boolean }) => setExercisePublic(exerciseId, isPublic),
    {
      onSuccess: (exercise) => {
        if (!exercise) return

        setQueriesData(queryClient, [NonDefaultExercises, UserExercises, DefaultExercises], (oldQueryData) =>
          (oldQueryData || []).map((ex) => (ex._id === exercise._id ? exercise : ex))
        )
      },
    }
  )
