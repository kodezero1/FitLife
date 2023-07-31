import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { getUserByEmail } from '../../../api-lib/mongo'
import { User } from '../../../types'
import { BaseUrl, MonthlyStripID, YearlyStripeID, StripeSecretKey } from '../../../utils/envs'
import { connectToDatabase } from '../../../utils/mongodb'

const stripe = new Stripe(StripeSecretKey, {
  apiVersion: '2022-08-01',
  typescript: true,
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method
  if (httpMethod !== 'POST') return res.status(405).end()

  try {
    const body = JSON.parse(req.body)

    const membershipPlan = body.membershipPlan as User['subscription']['plan']
    const email = body.email

    // Validate body params
    if (!membershipPlan || !(membershipPlan === 'month' || membershipPlan === 'year'))
      return res.status(400).send({ success: false, message: 'Invald membership plan' })

    if (!email) return res.status(400).send({ success: false, message: 'Please provide an email' })

    const { db } = await connectToDatabase()
    const user = await getUserByEmail(db, email)
    if (user?._id) return res.status(400).send({ success: false, message: 'This email is already registered' })

    const params: Stripe.Checkout.SessionCreateParams = {
      customer_email: email,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: membershipPlan === 'month' ? MonthlyStripID : YearlyStripeID,
          quantity: 1,
        },
      ],
      success_url: `${BaseUrl}/create-account/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${BaseUrl}/signup${membershipPlan === 'month' ? '' : '?plan=y'}`,
    }

    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)

    res.status(200).json(checkoutSession)
  } catch (e) {
    console.error(e.message)
    res.status(400).send({ success: false, message: e.message })
  }
}
