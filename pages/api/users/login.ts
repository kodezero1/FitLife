import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../../../types";
import { connectToDatabase } from "../../../utils/mongodb";
import { getUserByUsername, updateUserLastLoggedIn } from "../../../api-lib/mongo";
import { ActiveUsers } from "../../../api-lib/ActiveUsers";

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method;
  const { db } = await connectToDatabase();
  if (httpMethod !== "POST") return res.status(405).end();

  const { username, password }: { username: string; password: string } = req.body;
  const user: User | null = await getUserByUsername(db, username);

  if (user && user.password) {
    // Validate password entered with user.password retrieved from db
    const validLogin = bcrypt.compareSync(String(password), user.password);
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    if (validLogin && token) {
      delete user.password;
      delete user.email;

      user.lastLoggedIn = dayjs().toISOString();
      updateUserLastLoggedIn(db, user._id);

      ActiveUsers.add(user._id);

      res.status(201).json({ userData: user, token: token, success: true });
    } else {
      res.status(401).send({ success: false, message: "Invalid login credentials." });
    }
  } else {
    res.status(401).send({ success: false, message: "Invalid login credentials." });
  }
};
