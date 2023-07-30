import type { NextApiRequest, NextApiResponse } from 'next'
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '../../../utils/mongodb'
import { getUserByUsername, setUsernameAndPassword } from '../../../api-lib/mongo'
import { ActiveUsers } from '../../../api-lib/ActiveUsers'

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET || ''

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method
  const { db } = await connectToDatabase()

  // Require that fetch method be POST
  if (httpMethod !== 'POST') return res.status(405).end()

  // Hash password input
  const { username, password, email }: { username: string; password: string; email: string } = req.body

  try {
    const re = new RegExp(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/, 'gi')
    if (re.test(username))
      return res.status(403).send({
        success: false,
        message: 'Username must not contain special characters',
      })

    const hash = bcrypt.hashSync(password, SALT_ROUNDS)

    const existingUser = await getUserByUsername(db, username)

    if (existingUser) {
      res.status(403).send({ success: false, message: 'Username is already registered.' })
    } else {
      const userData = await setUsernameAndPassword(db, username, hash, email)
      const token = jwt.sign({ id: userData._id }, JWT_SECRET)
      ActiveUsers.add(userData._id)
      res.status(201).json({ userData, token, success: true })
    }
  } catch (e) {
    console.log(e)
    res.status(404).send({ success: false, message: e.message })
  }
}
