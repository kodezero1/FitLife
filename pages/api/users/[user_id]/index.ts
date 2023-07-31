import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../utils/mongodb";
import {
  addIdToUserFollowers,
  addIdToUserFollowing,
  addIdToUserRecentlyViewedUsers,
  addNewEntryInWorkoutLog,
  addToUserSavedWorkouts,
  decrementWorkoutNumLogged,
  getUserWorkoutLog,
  incrementWorkoutNumLogged,
  pushToUserWeight,
  removeEntryFromWorkoutLog,
  removeFromUserSavedWorkouts,
  removeIdFromUserFollowers,
  removeIdFromUserFollowing,
  updateUserBio,
  updateUserProfileImgUrl,
  userJoiningTeam,
  userLeavingTeam,
} from "../../../../api-lib/mongo";
import { verifyAuthToken } from "../../../../api-lib/auth/middleware";
import { ActiveUsers } from "../../../../api-lib/ActiveUsers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();
  let { user_id } = req.query;
  if (Array.isArray(user_id)) user_id = user_id[0];
  if (!user_id || typeof user_id !== "string") return res.status(404).end();

  ActiveUsers.add(user_id);

  switch (httpMethod) {
    case "GET":
      if (req.query.getUserWorkoutLog) {
        // Get workoutLog from start date to end date
        const { startDate, endDate } = req.query as { startDate: string; endDate: string };
        const log = await getUserWorkoutLog(db, user_id, startDate, endDate);
        return res.status(200).json(log);
      }
      res.status(400).end();

      break;
    case "POST":
      break;

    case "PUT":
      let validId = verifyAuthToken(req, user_id);
      if (!validId) return res.status(401).end();

      let UPDATED = false;

      const { addSavedWorkout } = JSON.parse(req.body);
      if (addSavedWorkout) UPDATED = await addToUserSavedWorkouts(db, user_id, addSavedWorkout);

      const { removeSavedWorkout } = JSON.parse(req.body);
      if (removeSavedWorkout)
        UPDATED = await removeFromUserSavedWorkouts(db, user_id, removeSavedWorkout);

      const { weight } = JSON.parse(req.body);
      if (weight) UPDATED = await pushToUserWeight(db, user_id, weight);

      const { follow } = JSON.parse(req.body);
      if (follow) {
        UPDATED = await addIdToUserFollowing(db, user_id, follow);
        UPDATED = await addIdToUserFollowers(db, follow, user_id);
      }

      const { unfollow } = JSON.parse(req.body);
      if (unfollow) {
        UPDATED = await removeIdFromUserFollowing(db, user_id, unfollow);
        UPDATED = await removeIdFromUserFollowers(db, unfollow, user_id);
      }

      const { bio } = JSON.parse(req.body);
      if (typeof bio === "string") UPDATED = await updateUserBio(db, user_id, bio);

      const { joinTeam } = JSON.parse(req.body);
      if (joinTeam) UPDATED = await userJoiningTeam(db, user_id, joinTeam);

      const { leaveTeam } = JSON.parse(req.body);
      if (leaveTeam) UPDATED = await userLeavingTeam(db, user_id, leaveTeam);

      const { profileImgUrl } = JSON.parse(req.body);
      if (profileImgUrl) UPDATED = await updateUserProfileImgUrl(db, user_id, profileImgUrl);

      const { addToRecentlyViewedUsers } = JSON.parse(req.body);
      if (addToRecentlyViewedUsers)
        UPDATED = await addIdToUserRecentlyViewedUsers(db, user_id, addToRecentlyViewedUsers);

      if (req.query.fieldToUpdate === "ADD_WORKOUT_TO_WORKOUT_LOG") {
        const { workoutLogKey } = req.query;
        if (!workoutLogKey || typeof workoutLogKey !== "string")
          return res.status(400).send("Missing or bad query key: workoutLogKey");

        const workoutData = JSON.parse(req.body);

        // Format workoutData correctly for DB
        delete workoutData.workout;
        if (workoutData.workout_id) workoutData.workout_id = new ObjectId(workoutData.workout_id);
        workoutData.exerciseData.forEach((each) => {
          delete each.exercise;
          each.exercise_id = new ObjectId(each.exercise_id);
        });

        const [isNewWorkout, saved] = await addNewEntryInWorkoutLog(
          db,
          user_id,
          workoutLogKey,
          workoutData
        );
        UPDATED = saved;

        if (isNewWorkout) incrementWorkoutNumLogged(db, workoutData.workout_id);
      }

      UPDATED ? res.status(201).json({}) : res.status(400).end();

      break;

    case "DELETE":
      if (req.query.fieldToUpdate === "DELETE_WORKOUT_FROM_WORKOUT_LOG") {
        let validId = verifyAuthToken(req, user_id);
        if (!validId) return res.status(401).end();

        const { workoutLogKey } = req.query;
        if (!workoutLogKey || typeof workoutLogKey !== "string")
          return res.status(400).send("Missing or bad query key: workoutLogKey");

        const [removedWorkout_id, saved] = await removeEntryFromWorkoutLog(
          db,
          user_id,
          workoutLogKey
        );
        decrementWorkoutNumLogged(db, removedWorkout_id);

        saved ? res.status(204).end() : res.status(404).end();
        break;
      }
      res.status(404).end();
      break;
  }
};
