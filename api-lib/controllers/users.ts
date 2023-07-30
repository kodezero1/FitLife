import { QueryClient, useMutation, useQuery } from "react-query";

import { addUserFollow, removeUserFollow } from "../../store";
import { getUserFromUsername } from "../fetchers";

const invalidateUserProfile = (queryClient: QueryClient) =>
  queryClient.invalidateQueries(["user-profile"]);

/**
 * @name useFollowMutation
 * @param queryClient const queryClient = useQueryClient()
 * @returns a Mutation object
 */
export const useFollowMutation = (queryClient: QueryClient) =>
  useMutation(
    (vars: { dispatch: any; userId: string; otherId: string }) =>
      addUserFollow(vars.dispatch, vars.userId, vars.otherId),
    { onSuccess: () => invalidateUserProfile(queryClient) }
  );

/**
 * @name useUnfollowMutation
 * @param queryClient const queryClient = useQueryClient()
 * @returns a Mutation object
 */
export const useUnfollowMutation = (queryClient: QueryClient) =>
  useMutation(
    (vars: { dispatch: any; userId: string; otherId: string }) => {
      return removeUserFollow(vars.dispatch, vars.userId, vars.otherId);
    },
    { onSuccess: () => invalidateUserProfile(queryClient) }
  );

/**
 *
 * @param username string to query
 * @returns User query object
 */
export const getUserByUsername = (username: string) =>
  useQuery(["user-profile", username], () => getUserFromUsername(username), {
    enabled: !!username,
  });
