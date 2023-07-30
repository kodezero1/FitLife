import { NextApiRequest } from "next";
import * as jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export function verifyAuthToken(req: NextApiRequest, idToMatch?: string | ObjectId) {
  if (idToMatch instanceof ObjectId) {
    idToMatch = idToMatch.toString();
  }

  const token = req.headers?.token as string;
  const JWT_SECRET = process.env.JWT_SECRET || "";

  try {
    if (!JWT_SECRET) throw new Error("A system error has occured.");
    if (!token) throw new Error("No token attached to headers.");

    const verified = jwt.verify(token, JWT_SECRET) as { id: string; iat: number };

    if (idToMatch && idToMatch !== verified.id) {
      throw new Error("Invalid credentials for specified request");
    }

    return verified.id;
  } catch (e) {
    console.log(e);
    return false;
  }
}
