import type { NextApiRequest, NextApiResponse } from "next";
import { getProfileImgUrlFromUsername, getUserByUsername } from "../../../api-lib/mongo";
import { connectToDatabase } from "../../../utils/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  if (httpMethod !== "GET") return res.status(405).end();

  const { db } = await connectToDatabase();

  const username = req.query.username;
  const shortUser = req.query.shortUser;

  if (typeof shortUser === "string") {
    // Get ShortUser
    const user = await getProfileImgUrlFromUsername(db, shortUser);
    return res.status(200).json(user);
  } else if (typeof username === "string") {
    // Get user from username (ex: user profile query)
    const user = await getUserByUsername(db, username);
    delete user.password;
    delete user.email;
    return res.status(200).json(user);
  }
};
