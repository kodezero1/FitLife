import { loadStripe } from '@stripe/stripe-js/pure'
import type { Stripe } from '@stripe/stripe-js'
import { StripePublishableKey } from './envs'

let stripePromise: Promise<Stripe | null>

const getStripe = () => {
  if (!stripePromise) {
    loadStripe.setLoadParameters({ advancedFraudSignals: false })
    stripePromise = loadStripe(StripePublishableKey)
  }

  return stripePromise
}

export default getStripe
