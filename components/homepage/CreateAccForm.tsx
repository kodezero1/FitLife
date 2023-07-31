import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import type Stripe from 'stripe'

import { useUserDispatch, assignUsernameAndPassword } from '../../store'
import { LoginContainer } from '../../components/homepage/LoginForm'
import { User } from '../../types'

interface Props {
  checkoutSession?: Stripe.Checkout.Session | null
  user?: User | null
  pageErrorMessage?: string | null
  freeAccountEmail?: string
}

const CreateAccForm = ({ checkoutSession, user, pageErrorMessage, freeAccountEmail }: Props) => {
  const router = useRouter()
  const dispatch = useUserDispatch()

  const passwordToggle = useRef<HTMLButtonElement>(null)

  const [passwordType, setPasswordView] = useState<'password' | 'text'>('password')
  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [accCreds, setAccCreds] = useState<{
    username: string
    password: string
  }>({
    username: '',
    password: '',
  })

  const sessionEmail = checkoutSession?.customer_email || freeAccountEmail || ''

  const handleAssignUsernameAndPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!sessionEmail) return setFormErrorMessage('No valid checkout session exists.')

    const response = await assignUsernameAndPassword(dispatch, accCreds.username, accCreds.password, sessionEmail)
    response.success ? router.push(`/log`) : setFormErrorMessage(response.message)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Username cannot contain special characters
    setAccCreds((prev) => ({
      ...prev,
      username: e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccCreds((prev) => ({ ...prev, password: e.target.value }))
  }

  const togglePasswordView = () => {
    if (passwordType === 'password') {
      setPasswordView('text')
      passwordToggle.current?.setAttribute('aria-label', 'Hide password')
    } else {
      setPasswordView('password')
      passwordToggle.current?.setAttribute(
        'aria-label',
        'Show password as plain text. ' + 'Warning: this will display your password on the screen'
      )
    }
  }

  if (pageErrorMessage) {
    return (
      <CreateContainer>
        <div className="temp-wrap">
          <h2>An Error Occured:</h2>
          <p className="error-message">{pageErrorMessage}</p>
          <a href="https://www.christiancodes.co/contact" target={'_blank'}>
            Message Support
          </a>
        </div>
      </CreateContainer>
    )
  }

  if (user?.username) {
    return (
      <CreateContainer>
        <div className="temp-wrap">
          <h2>Hi {user.username}, your account has already been created</h2>
          <Link href="/login">Login Here</Link>
        </div>
      </CreateContainer>
    )
  }

  if (!sessionEmail) {
    return (
      <CreateContainer>
        <div className="temp-wrap">
          <h2>Interested in joining Lift Club?</h2>
          <Link href="/membership">See Membership Options</Link>
        </div>
      </CreateContainer>
    )
  }

  return (
    <CreateContainer>
      <form action="POST" onSubmit={handleAssignUsernameAndPassword}>
        <span className="display-email">{sessionEmail}</span>

        <div>
          <input
            type="text"
            name="liftclub-username"
            id="username"
            value={accCreds.username}
            onChange={handleUsernameChange}
            placeholder="Username"
            required
            aria-label="create account username"
          />

          <section className="pw-section">
            <input
              type={passwordType}
              name="password"
              id="password"
              value={accCreds.password}
              onChange={handlePasswordChange}
              placeholder="Password"
              required
              autoComplete="current-password"
              aria-label="create account password"
            />
            <button
              type="button"
              className="show-pw"
              onClick={togglePasswordView}
              ref={passwordToggle}
              aria-label="Show password as plain text. Warning: this will display your password on the screen"
            >
              {passwordType === 'password' ? showEye : hideEye}
            </button>
          </section>
        </div>

        <button type="submit" disabled={!Boolean(accCreds.password && accCreds.username)}>
          Create Account
        </button>
      </form>

      {formErrorMessage && <p className="error-msg">{formErrorMessage}</p>}
    </CreateContainer>
  )
}
export default CreateAccForm

const CreateContainer = styled(LoginContainer)`
  .display-email {
    color: ${({ theme }) => theme.textLight};
    font-size: 0.9rem;
  }
  .temp-wrap {
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h2 {
      font-weight: 300;
    }
    a {
      margin-top: 1rem;
      font-size: 0.9rem;
    }
    .error-message {
      padding: 1rem 0;
    }
  }
`

const showEye = (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 9a3.02 3.02 0 0 0-3 3c0 1.642 1.358 3 3 3 1.641 0 3-1.358 3-3 0-1.641-1.359-3-3-3z"></path>
    <path d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316-.105-.316C21.927 11.617 19.633 5 12 5zm0 12c-5.351 0-7.424-3.846-7.926-5C4.578 10.842 6.652 7 12 7c5.351 0 7.424 3.846 7.926 5-.504 1.158-2.578 5-7.926 5z"></path>
  </svg>
)

const hideEye = (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 19c.946 0 1.81-.103 2.598-.281l-1.757-1.757c-.273.021-.55.038-.841.038-5.351 0-7.424-3.846-7.926-5a8.642 8.642 0 0 1 1.508-2.297L4.184 8.305c-1.538 1.667-2.121 3.346-2.132 3.379a.994.994 0 0 0 0 .633C2.073 12.383 4.367 19 12 19zm0-14c-1.837 0-3.346.396-4.604.981L3.707 2.293 2.293 3.707l18 18 1.414-1.414-3.319-3.319c2.614-1.951 3.547-4.615 3.561-4.657a.994.994 0 0 0 0-.633C21.927 11.617 19.633 5 12 5zm4.972 10.558-2.28-2.28c.19-.39.308-.819.308-1.278 0-1.641-1.359-3-3-3-.459 0-.888.118-1.277.309L8.915 7.501A9.26 9.26 0 0 1 12 7c5.351 0 7.424 3.846 7.926 5-.302.692-1.166 2.342-2.954 3.558z"></path>
  </svg>
)
