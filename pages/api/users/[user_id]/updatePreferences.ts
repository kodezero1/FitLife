import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthToken } from "../../../../api-lib/auth/middleware";
import { updateUserPreference } from "../../../../api-lib/mongo";
import { connectToDatabase } from "../../../../utils/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  if (httpMethod !== "PUT") return res.status(405).end();

  const { db } = await connectToDatabase();

  let user_id = req.query.user_id;
  if (Array.isArray(user_id)) user_id = user_id[0];
  if (!user_id || typeof user_id !== "string") return res.status(404).end();

  let validId = verifyAuthToken(req, user_id);
  if (!validId) return res.status(401).end();

  const { preferenceKey, preferenceValue } = await JSON.parse(req.body);

  if (user_id && preferenceKey && preferenceValue !== undefined) {
    const updated = await updateUserPreference(db, user_id, preferenceKey, preferenceValue);
    return res.status(updated ? 201 : 400).end();
  } else {
    return res.status(404).end();
  }
};
