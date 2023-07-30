import React from 'react'
import type Stripe from 'stripe'

import Branding from '../../components/homepage/Branding'
import CreateAccForm from '../../components/homepage/CreateAccForm'
import { User } from '../../types'
import { BaseUrl } from '../../utils/envs'
import { FormContainer } from '../login'

interface Props {
  pageProps: {
    checkoutSession: Stripe.Checkout.Session | null
    user: User | null
    pageErrorMessage: string | null
  }
}

export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`${BaseUrl}/api/checkout_sessions/${params.session_id}`)
    const { checkoutSession, user, message } = await res.json()
    return {
      props: {
        checkoutSession: checkoutSession || null,
        user: user || null,
        pageErrorMessage: message || null,
      },
    }
  } catch (e) {
    console.log(e)
    return { props: { checkoutSession: null, user: null, pageErrorMessage: e.message || null } }
  }
}

const createAccountPage = ({ pageProps: { checkoutSession, user, pageErrorMessage } }: Props) => {
  return (
    <FormContainer>
      <Branding />

      <CreateAccForm checkoutSession={checkoutSession} user={user} pageErrorMessage={pageErrorMessage} />
    </FormContainer>
  )
}

export default createAccountPage
