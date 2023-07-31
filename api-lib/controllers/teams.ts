import { QueryClient, useMutation, useQuery } from "react-query";
import { Updater } from "react-query/types/core/utils";
import { Team, User } from "../../types";
import {
  deleteTeam,
  getAllTeamsByMemberCount,
  getTeamsFromIdArray,
  postNewTeam,
  updateTeam,
} from "../fetchers";

const UserTeams = "user-teams";
const AllTeams = "all-teams";

const setQueriesData = (
  queryClient: QueryClient,
  queryKey: string | string[],
  updater: Updater<Team[] | undefined, Team[]>
) => {
  const query = (key: string) => queryClient.setQueriesData(key, updater);
  if (Array.isArray(queryKey)) queryKey.forEach((key) => query(key));
  else query(queryKey);
};

export const getAllTeams = () => useQuery(AllTeams, getAllTeamsByMemberCount);

/**
 *
 * @param user User object
 * @returns Teams[] query object
 */
export const getUserTeams = (user?: User) =>
  useQuery([UserTeams, user?._id], () => getTeamsFromIdArray(user?.teamsJoined || []), {
    enabled: !!user,
  });

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useCreateTeam = (
  queryClient: QueryClient,
  options?: { onSuccess: (team: Team) => void }
) =>
  useMutation(({ team }: { team: Team }) => postNewTeam(team), {
    onSuccess: (team) => {
      if (!team) return;

      options?.onSuccess && options.onSuccess(team);
      setQueriesData(queryClient, [UserTeams, AllTeams], (oldQueryData) => [
        team,
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
export const useUpdateTeam = (
  queryClient: QueryClient,
  options?: { onSuccess: (team: Team) => void }
) =>
  useMutation(({ team }: { team: Team }) => updateTeam(team), {
    onSuccess: (team) => {
      if (!team) return;

      options?.onSuccess && options.onSuccess(team);
      setQueriesData(queryClient, [UserTeams, AllTeams], (oldQueryData) => [
        ...(oldQueryData || []).map((r) => (r._id === team._id ? team : r)),
      ]);
    },
  });

/**
 *
 * @param queryClient
 * @param options
 * @returns
 */
export const useDeleteTeam = (
  queryClient: QueryClient,
  options?: { onSuccess: (teamId: string) => void }
) =>
  useMutation(({ teamId }: { teamId: string }) => deleteTeam(teamId), {
    onSuccess: (teamId) => {
      if (!teamId) return;

      options?.onSuccess && options.onSuccess(teamId);
      setQueriesData(queryClient, [AllTeams, UserTeams], (oldQueryData) => [
        ...(oldQueryData || []).filter((t) => t._id !== teamId),
      ]);
    },
  });
