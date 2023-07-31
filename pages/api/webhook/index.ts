import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { buffer } from 'micro'
import { StripeSecretKey, StripeWebhookSecret } from '../../../utils/envs'
import { connectToDatabase } from '../../../utils/mongodb'
import { initializeAccount, userSubscriptionUpdated } from '../../../api-lib/mongo'
import { User } from '../../../types'

const stripe = new Stripe(StripeSecretKey, { apiVersion: '2022-08-01', typescript: true })

export const config = {
  api: { bodyParser: false },
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method
  if (httpMethod !== 'POST') return res.status(405).end()

  try {
    const rawBody = await buffer(req)
    let signature = req.headers['stripe-signature']

    if (Array.isArray(signature)) signature = signature[0]
    if (!signature || typeof signature !== 'string') return res.status(404).end()

    const event = stripe.webhooks.constructEvent(rawBody.toString(), signature, StripeWebhookSecret)

    // Handle the Stripe event
    const { data, type } = event
    if (Handlers[type] instanceof Function) {
      await Handlers[type](data, stripe)
    } else {
      console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ success: true })
  } catch (e) {
    res.status(400).json({ message: e.message, success: false })
  }
}

type HandlerFunction = (data: Stripe.Event.Data, stripe: Stripe) => Promise<void>

const Handlers: { [key: string]: HandlerFunction } = {
  'checkout.session.completed': async (data) => {
    const sessionCompleted = data.object as Stripe.Checkout.Session

    if (!sessionCompleted.customer_email || !sessionCompleted.customer) return

    const newUser = {
      email: sessionCompleted.customer_email,
      customerId: sessionCompleted.customer.toString(),
    }

    const { db } = await connectToDatabase()
    await initializeAccount(db, newUser)
    console.log('Checkout Session Completed: ', sessionCompleted)
  },

  'customer.subscription.updated': async (data) => {
    const subscriptionUpdated = data.object as any

    const subscriptionStart = subscriptionUpdated.current_period_start
    const subscriptionEnd = subscriptionUpdated.current_period_end
    const subPlanInterval = subscriptionUpdated.plan.interval
    const isPlanActive = subscriptionUpdated.status === 'active'
    const customerId = subscriptionUpdated.customer.toString()

    const subscription: User['subscription'] = {
      active: isPlanActive,
      plan: subPlanInterval,
      currentPeriodEnd: subscriptionEnd,
      currentPeriodStart: subscriptionStart,
      customerId: customerId,
    }

    const { db } = await connectToDatabase()
    userSubscriptionUpdated(db, subscription)
    console.log('Customer Subscription Updated', subscriptionUpdated)
  },

  'customer.subscription.deleted': async (data) => {
    const subscriptionDeleted = data.object as any

    if (subscriptionDeleted.request === null) {
      const { db } = await connectToDatabase()
      userSubscriptionUpdated(db, { active: false, plan: 'free' })
    }
    console.log('Customer Subscription Deleted', subscriptionDeleted)
  },

  'invoice.paid': async (data) => {
    const invoicePaid = data.object as any
    const isPaid = invoicePaid.status === 'paid'

    const { db } = await connectToDatabase()
    userSubscriptionUpdated(db, { active: isPaid })
    console.log('Invoice Paid', invoicePaid)
  },

  'invoice.payment_failed': async (data) => {
    const invoiceFailed = data.object as any
    const isPaid = invoiceFailed.status === 'paid'

    const { db } = await connectToDatabase()
    userSubscriptionUpdated(db, { active: isPaid, plan: 'free' })
    console.log('Invoice Payment Failed', invoiceFailed)
  },
}
