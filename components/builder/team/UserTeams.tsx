import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// Context
import { useUserState } from "../../../store";
// API
import { getTeamById } from "../../../api-lib/fetchers";
// Interfaces
import { Team } from "../../../types";
// Components
import DeleteTeamModal from "./DeleteTeamModal";
import TiledList from "../../Shared/TiledList";
import { getUserTeams } from "../../../api-lib/controllers";

interface Props {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team>>;
  clearTeam: () => void;
}

const UserTeams: React.FC<Props> = ({ team, setTeam, clearTeam }) => {
  const router = useRouter();
  const { user } = useUserState();

  const { data: teams } = getUserTeams(user);

  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [loading, setLoading] = useState<string>("");
  const [hasQueriedUrl, setHasQueriedUrl] = useState(false);

  const handleTeamClick = async (team: Team) => {
    setLoading(team._id);

    const teamData = await getTeamById(team._id);
    if (teamData) setTeam(teamData);

    setLoading("");
  };

  // If url has query for specific team, set that team
  useEffect(() => {
    const queriedTeam_id = router.query.team as string;
    if (queriedTeam_id && teams && !hasQueriedUrl) {
      const queried = teams.find((each) => each._id === queriedTeam_id);
      if (queried) handleTeamClick(queried);
      setHasQueriedUrl(true);
    }
  }, [teams]);

  return (
    <>
      <div className="tile">
        <h3>My Teams</h3>

        <TiledList
          listName="my-teams"
          items={teams}
          onItemClick={(team) => handleTeamClick(team)}
          displayProp="teamName"
          onDeleteClick={(userTeam) => setTeamToDelete(userTeam)}
          keyProp="_id"
          isHighlighted={(userTeam) => team._id === userTeam._id}
          isLoading={(userTeam) => loading === userTeam._id}
        />
      </div>

      {teamToDelete && (
        <DeleteTeamModal
          team={teamToDelete}
          setTeamToDelete={setTeamToDelete}
          clearTeam={clearTeam}
        />
      )}
    </>
  );
};
export default UserTeams;
