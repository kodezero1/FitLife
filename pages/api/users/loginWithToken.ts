import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../utils/mongodb'
import { verifyAuthToken } from '../../../api-lib/auth/middleware'
import { getShortLogUserById, getUserById, updateUserLastLoggedIn } from '../../../api-lib/mongo'
import { ActiveUsers } from '../../../api-lib/ActiveUsers'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method
  const { db } = await connectToDatabase()

  if (httpMethod !== 'POST') return res.status(405).end()

  // Get a specific user from authToken
  let validId = verifyAuthToken(req)
  if (!validId) return res.status(401).end({ success: false, message: 'Invalid auth token' })

  const queryShortLog = Boolean(req.query.short)

  let userData = queryShortLog ? await getShortLogUserById(db, validId) : await getUserById(db, validId)

  if (userData) {
    updateUserLastLoggedIn(db, userData._id)

    delete userData.password
    delete userData.email

    ActiveUsers.add(userData._id)

    return res.status(201).json({ userData, success: true })
  } else {
    return res.status(400).end({ success: false, message: 'No user found' })
  }
}
