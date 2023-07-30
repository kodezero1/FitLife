import React, { useState, useEffect } from "react";
// Context
import { useUserState } from "../../../store";
// Interfaces
import { Routine, Team } from "../../../types";
// Components
import ControlsBar from "./ControlsBar";
import UserTeams from "./UserTeams";
import TrainersTile from "./TrainersTile";
import RoutinesTile from "./RoutinesTile";

const initialTeam: Team = {
  _id: "",
  teamName: "",
  members: [],
  dateCreated: "",
  creatorName: "",
  creator_id: "",
  trainers: [],
  routine_id: "",
  routine: {} as Routine,
};

const TeamBuilder: React.FC = () => {
  const { user } = useUserState();

  const [team, setTeam] = useState<Team>(initialTeam);

  const clearTeam = () => {
    setTeam({
      ...initialTeam,
      creator_id: user!._id,
      creatorName: user!.username,
    });
  };

  useEffect(() => {
    if (user)
      setTeam({
        ...team,
        creatorName: user.username,
        creator_id: user._id,
        members: [user!._id],
      });
  }, [user]);

  return (
    <>
      <ControlsBar team={team} setTeam={setTeam} clearTeam={clearTeam} />

      <UserTeams team={team} setTeam={setTeam} clearTeam={clearTeam} />

      <TrainersTile team={team} setTeam={setTeam} />

      <RoutinesTile team={team} setTeam={setTeam} />
    </>
  );
};
export default TeamBuilder;
