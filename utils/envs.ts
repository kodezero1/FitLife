export const BaseUrl = process.env.NODE_ENV === 'production' ? 'https://liftclub.app' : 'http://localhost:3000'

export const YearlyStripeID =
  process.env.NODE_ENV === 'production' ? 'price_1M50GDHmySWsXQX72D13x5Jm' : 'price_1M4zkJHmySWsXQX7t7LbTaTU'
export const MonthlyStripID =
  process.env.NODE_ENV === 'production' ? 'price_1M4DwmHmySWsXQX78bvZDbaT' : 'price_1M4HjNHmySWsXQX7qe7CuN54'

export const StripeSecretKey =
  process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_KEY! : process.env.STRIPE_SECRET_KEY_TEST!

export const StripeWebhookSecret =
  process.env.NODE_ENV === 'production' ? process.env.STRIPE_WEBHOOK_SECRET! : process.env.STRIPE_WEBHOOK_SECRET_TEST!

export const StripePublishableKey =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST!

export const StripePortalURL =
  process.env.NODE_ENV === 'production'
    ? 'https://billing.stripe.com/p/login/8wMeX83GZ7iAdpe144'
    : 'https://billing.stripe.com/p/login/test_7sI4gRgVfcwU0248ww'
