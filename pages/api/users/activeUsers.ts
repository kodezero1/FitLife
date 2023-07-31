import type { NextApiRequest, NextApiResponse } from "next";
import { ActiveUsers } from "../../../api-lib/ActiveUsers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  if (httpMethod !== "GET") return res.status(405).end();

  const query_id = req.query.user_id as string;

  if (query_id) {
    res.status(200).json({ active: ActiveUsers.isUserActive(query_id) });
  } else {
    res
      .status(200)
      .json({ activeUsers: ActiveUsers.getAll(), activeCount: ActiveUsers.getCount() });
  }
};
