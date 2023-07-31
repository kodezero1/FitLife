import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import { searchUsernameQuery } from "../../../api-lib/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();

  if (httpMethod !== "GET") return res.status(405).end();

  const { query } = req.query;
  if (!query || typeof query !== "string") return res.status(404).end();

  const foundUsers = await searchUsernameQuery(db, query);

  res.json(foundUsers);
};
