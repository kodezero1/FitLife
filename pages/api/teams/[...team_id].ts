import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../utils/mongodb";
// Interfaces
import {
  addTrainerToTeam,
  deleteTeam,
  getAggregatedTeamsById,
  getTeam,
  removeTrainerFromTeam,
  updateTeam,
} from "../../../api-lib/mongo";
import { verifyAuthToken } from "../../../api-lib/auth/middleware";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();
  let { team_id } = req.query;
  if (Array.isArray(team_id)) team_id = team_id[0];
  if (!team_id || typeof team_id !== "string") return res.status(404).end();
  let validId: string | false;

  switch (httpMethod) {
    case "GET":
      const [team] = await getAggregatedTeamsById(db, team_id);
      res.json(team);
      break;
    case "POST":
      const { wholeTeam } = req.query;
      if (wholeTeam) {
        const team = JSON.parse(req.body);

        validId = verifyAuthToken(req, team.creator_id);
        if (!validId) return res.redirect(401, "/");

        team._id = new ObjectId(team._id);
        team.members = team.members.map((mem: string) => new ObjectId(mem));
        team.dateCreated = new Date(team.dateCreated);
        team.creator_id = new ObjectId(team.creator_id);
        team.trainers = team.trainers.map((_id: string) => new ObjectId(_id));
        team.routine_id = new ObjectId(team.routine_id);

        const updated = await updateTeam(db, team);
        updated ? res.status(204).end() : res.status(404).end();
      }
      break;
    case "PUT":
      const creator_id = req.query.creator_id?.toString() || "";
      if (!creator_id) return res.status(400).send("Missing query parameter: creator_id");

      const { addTrainer } = req.query;
      if (addTrainer) {
        validId = verifyAuthToken(req, creator_id);
        if (!validId) return res.redirect(401, "/");

        const updated = await addTrainerToTeam(db, team_id, addTrainer.toString());
        updated ? res.status(204).end() : res.status(400).end();
      }

      const { removeTrainer } = req.query;
      if (removeTrainer) {
        validId = verifyAuthToken(req, creator_id);
        if (!validId) return res.redirect(401, "/");

        const updated = await removeTrainerFromTeam(db, team_id, removeTrainer.toString());
        updated ? res.status(204).end() : res.status(400).end();
      }

      break;
    case "DELETE":
      const teamToVerify = await getTeam(db, team_id);

      validId = verifyAuthToken(req, teamToVerify.creator_id.toString());
      if (!validId) return res.redirect(401, "/");

      const deleted = await deleteTeam(db, team_id);
      deleted ? res.status(204).end() : res.status(400).end();
      break;
  }
};
