import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../utils/mongodb'
import { getUserByEmail, initializeAccount } from '../../../api-lib/mongo'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method
  const { db } = await connectToDatabase()

  // Require that fetch method be POST
  if (httpMethod !== 'POST') return res.status(405).end()

  // Hash password input
  const { email }: { email: string } = req.body

  try {
    const existingUser = await getUserByEmail(db, email)

    if (existingUser) {
      res.status(403).send({ success: false, message: 'This email is already registered' })
    } else {
      const userData = await initializeAccount(db, { email })
      res.status(201).json({ userData, success: true })
    }
  } catch (e) {
    console.log(e)
    res.status(404).send({ success: false, message: e.message })
  }
}
