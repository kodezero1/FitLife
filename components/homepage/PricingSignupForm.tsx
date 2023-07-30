import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'

import getStripe from '../../utils/get-stripejs'
import { LoginContainer } from './LoginForm'
import DemoLoginButton from './DemoLoginButton'
import { User } from '../../types'
import { initializeFreeAccount } from '../../store'
import CreateAccForm from './CreateAccForm'

interface Props {}

const PricingSignupForm: React.FC<Props> = () => {
  const router = useRouter()

  const [freeAccountInitialized, setFreeAccountInitialized] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [accCreds, setAccCreds] = useState<{
    email: string
    membershipPlan: User['subscription']['plan']
  }>({
    email: '',
    membershipPlan: router.query.plan === 'm' ? 'month' : router.query.plan === 'y' ? 'year' : 'free',
  })

  const redirectToCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (accCreds.membershipPlan === 'free') {
      const response = await initializeFreeAccount(accCreds.email)

      response.success ? setFreeAccountInitialized(true) : setErrorMessage(response.message)
    } else {
      try {
        const res = await fetch('/api/checkout_sessions', {
          method: 'POST',
          body: JSON.stringify(accCreds),
        })
        const session = await res.json()

        if (res.status === 200) {
          const stripe = await getStripe()
          await stripe?.redirectToCheckout({ sessionId: session.id })
        } else {
          setErrorMessage(session.message)
        }
      } catch (e) {
        setErrorMessage(e.message)
      }
    }
  }

  const handleEmailChange = (e) => {
    setAccCreds((prev) => ({ ...prev, email: e.target.value }))
  }

  useEffect(() => {
    setAccCreds((prev) => ({
      ...prev,
      membershipPlan: router.query.plan === 'm' ? 'month' : router.query.plan === 'y' ? 'year' : 'free',
    }))
  }, [router.query.plan])

  return freeAccountInitialized ? (
    <CreateAccForm freeAccountEmail={accCreds.email} />
  ) : (
    <CreateContainer plan={accCreds.membershipPlan}>
      <form action="POST" onSubmit={redirectToCheckout}>
        <div>
          <input
            type="email"
            name="email"
            id="email"
            value={accCreds.email}
            onChange={handleEmailChange}
            placeholder="Email"
            required
            aria-label="create account email"
          />
        </div>

        <div className="membership-section">
          <div className="membership-toggle-container">
            <button
              type="button"
              className="free"
              onClick={() => setAccCreds((prev) => ({ ...prev, membershipPlan: 'free' }))}
            >
              Free
            </button>
            <button
              type="button"
              className="month"
              onClick={() => setAccCreds((prev) => ({ ...prev, membershipPlan: 'month' }))}
            >
              $1 / month
            </button>
            <button
              type="button"
              className="year"
              onClick={() => setAccCreds((prev) => ({ ...prev, membershipPlan: 'year' }))}
            >
              $10 / year
            </button>
          </div>
        </div>

        {errorMessage && <p className="error-msg">{errorMessage}</p>}

        <button type="submit" disabled={!Boolean(accCreds.email && accCreds.membershipPlan)}>
          Sign Up
        </button>
      </form>

      <div className="other-links">
        <Link href="/login">Have an account? Login here</Link>
        <hr />
        <DemoLoginButton />
      </div>
    </CreateContainer>
  )
}
export default PricingSignupForm

const CreateContainer = styled(LoginContainer)<{ plan: User['subscription']['plan'] }>`
  .membership-section {
    margin-bottom: 1rem;

    .membership-toggle-container {
      height: 2.2rem;
      border-radius: 5px;
      background: ${({ theme }) => theme.medOpacity};
      display: flex;
      align-items: stretch;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 33.33%;
        z-index: 1;
        border-radius: 5px;
        transition: transform 0.2s ease;
        transform: translateX(${({ plan }) => (plan === 'free' ? '0%' : plan === 'month' ? '100%' : '200%')});
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.defaultAccent};
      }

      button {
        flex: 1;
        font-size: 0.85rem;
        background: transparent;
        z-index: 2;
        position: relative;

        &:active {
          box-shadow: none !important;
        }

        &.free {
          color: ${({ plan, theme }) => (plan === 'free' ? theme.text : theme.textLight)};
        }
        &.year {
          color: ${({ plan, theme }) => (plan === 'year' ? theme.text : theme.textLight)};
        }
        &.month {
          color: ${({ plan, theme }) => (plan === 'month' ? theme.text : theme.textLight)};
        }
      }
    }
  }
`
