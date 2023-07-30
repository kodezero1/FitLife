import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../utils/mongodb";
import { Workout } from "../../../types";
import { verifyAuthToken } from "../../../api-lib/auth/middleware";
import { deleteWorkout, getWorkout, updateWorkout } from "../../../api-lib/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  let { workout_id } = req.query;
  if (Array.isArray(workout_id)) workout_id = workout_id[0];
  if (!workout_id || typeof workout_id !== "string") return res.status(404).end();

  let validId: string | false;

  switch (httpMethod) {
    case "GET":
      const workoutData: Workout = await getWorkout(db, workout_id);
      res.json(workoutData);
      break;
    case "POST":
      break;
    case "PUT":
      const updatedWorkout = JSON.parse(req.body); // no type
      validId = verifyAuthToken(req, updatedWorkout.creator_id);
      if (!validId) return res.redirect(401, "/");

      // Cast all string ids to ObjectIds
      updatedWorkout._id = new ObjectId(updatedWorkout._id);
      updatedWorkout.creator_id = new ObjectId(updatedWorkout.creator_id);
      updatedWorkout.exercises.map((each) => (each.exercise_id = new ObjectId(each.exercise_id)));
      updatedWorkout.muscleGroups.map(
        (item) => (item[1].exerciseIds = item[1].exerciseIds.map((id) => (id = new ObjectId(id))))
      );

      const updated = await updateWorkout(db, updatedWorkout);

      updated ? res.status(204).end() : res.status(404).end();
      break;
    case "DELETE":
      const workout = await getWorkout(db, workout_id);

      validId = verifyAuthToken(req, workout.creator_id);
      if (!validId) return res.redirect(401, "/");

      const deleted = await deleteWorkout(db, workout_id);
      deleted ? res.status(204).end() : res.status(400).end();
      break;
  }
};
