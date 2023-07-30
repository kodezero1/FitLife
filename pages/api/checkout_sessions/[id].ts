import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { getUserByEmail } from '../../../api-lib/mongo'
import { User } from '../../../types'
import { StripeSecretKey } from '../../../utils/envs'
import { connectToDatabase } from '../../../utils/mongodb'

const stripe = new Stripe(StripeSecretKey, { apiVersion: '2022-08-01', typescript: true })

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method
  if (httpMethod !== 'GET') return res.status(405).end()

  let session_id = req.query.id
  if (Array.isArray(session_id)) session_id = session_id[0]
  if (!session_id || session_id === 'undefined' || typeof session_id !== 'string')
    return res.status(404).send({ message: 'Missing Stripe session ID' })

  try {
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(session_id)

    let user: User | null = null
    if (checkoutSession.customer_email) {
      const { db } = await connectToDatabase()
      user = await getUserByEmail(db, checkoutSession.customer_email)
    }

    res.status(200).json({ checkoutSession, user: user || null })
  } catch (e) {
    res.status(400).send({ message: e.message })
  }
}
