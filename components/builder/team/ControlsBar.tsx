import React, { useEffect, useState } from "react";
// Components
import Checkmark from "../../Checkmark";
import { BuilderControlBarStyles, BuilderControlButtons } from "../workout/ControlsBar";
// Interfaces
import { Team } from "../../../types";
import { userJoiningTeam, useUserDispatch, useUserState } from "../../../store";
import { useQueryClient } from "react-query";
import { useCreateTeam, useUpdateTeam } from "../../../api-lib/controllers";

interface Props {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team>>;
  clearTeam: () => void;
}

const ControlsBar: React.FC<Props> = ({ team, setTeam, clearTeam }) => {
  const { user } = useUserState();
  const userDispatch = useUserDispatch();
  const queryClient = useQueryClient();

  const [showSaveNotification, setShowSaveNotification] = useState<null | boolean>(null);

  const onSaveSuccess = () => {
    setShowSaveNotification(true);
    clearTeam();
  };

  const { mutate: updateTeam } = useUpdateTeam(queryClient, { onSuccess: onSaveSuccess });
  const { mutate: createTeam } = useCreateTeam(queryClient, {
    onSuccess: (team) => {
      userJoiningTeam(userDispatch, user!._id, team._id);
      onSaveSuccess();
    },
  });

  const saveTeam = async () => {
    team._id ? updateTeam({ team }) : createTeam({ team });
  };

  const handleTeamNameChange = (e) => {
    setTeam((prev) => ({ ...prev, teamName: e.target.value }));
  };

  useEffect(() => {
    let resetTimeout: NodeJS.Timeout;
    if (showSaveNotification) resetTimeout = setTimeout(() => setShowSaveNotification(null), 2000);
    return () => clearTimeout(resetTimeout);
  }, [showSaveNotification]);

  return (
    <BuilderControlBarStyles className="tile">
      <div className="input-wrapper">
        <label htmlFor="workoutName">Team Name</label>
        <input type="text" name="teamName" value={team.teamName} onChange={handleTeamNameChange} />
      </div>
      <BuilderControlButtons>
        <button onClick={saveTeam} disabled={!Boolean(team.teamName && team.routine_id)}>
          {showSaveNotification && !Boolean(team.routine_id) ? (
            <Checkmark styles={{ height: "1.75rem", width: "1.75rem" }} />
          ) : (
            "Save Team"
          )}
        </button>

        <button
          onClick={clearTeam}
          disabled={!Boolean(team.teamName.length || team.routine_id.length | team.trainers.length)}
        >
          Clear
        </button>
      </BuilderControlButtons>
    </BuilderControlBarStyles>
  );
};
export default ControlsBar;
