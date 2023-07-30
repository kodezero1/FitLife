import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";
import { connectToDatabase } from "../../../utils/mongodb";
import { Workout } from "../../../types";
import { verifyAuthToken } from "../../../api-lib/auth/middleware";
import {
  findPublicWorkouts,
  queryWorkoutsByCreatorId,
  postNewWorkout,
} from "../../../api-lib/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  switch (httpMethod) {
    case "GET":
      let workouts: Workout[] = [];

      const creator_id = req.query.creator_id as string;
      if (creator_id) {
        workouts = await queryWorkoutsByCreatorId(db, creator_id as string);
        res.json(workouts);
      }

      const isPublic = req.query.isPublic as string;
      if (isPublic) {
        workouts = await findPublicWorkouts(db);
        res.json(workouts);
      }

      res.status(401).end();
      break;
    case "POST":
      const newWorkout = JSON.parse(req.body); // no type

      const validId = verifyAuthToken(req, newWorkout.creator_id);
      if (!validId) return res.redirect(401, "/");

      // Cast all string ids to ObjectIds
      newWorkout.creator_id = new ObjectId(newWorkout.creator_id);
      newWorkout.exercises.map((each) => (each.exercise_id = new ObjectId(each.exercise_id)));
      // Format date
      newWorkout.date_created = dayjs(newWorkout.date_created).toISOString();

      const insertedId = await postNewWorkout(db, newWorkout);

      insertedId ? res.status(201).json({ workout_id: insertedId }) : res.status(404).end();

      break;
    case "PUT":
      break;
    case "DELETE":
      break;
  }
};
