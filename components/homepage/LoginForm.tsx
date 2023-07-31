import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'

import { useUserDispatch, authLogin } from '../../store'
import { StripePortalURL } from '../../utils/envs'
//import DemoLoginButton from './DemoLoginButton'

interface Props {}

const Login: React.FC<Props> = () => {
  const router = useRouter()

  const dispatch = useUserDispatch()

  const passwordToggle = useRef<HTMLButtonElement>(null)

  const [loadingLogin, setLoadingLogin] = useState(false)
  const [passwordType, setPasswordView] = useState<'password' | 'text'>('password')
  const [errorMessage, setErrorMessage] = useState('')
  const [subscriptionExpired, setSubscriptionExpired] = useState(false)
  const [loginCreds, setLoginCreds] = useState<{ username: string; password: string }>({ username: '', password: '' })

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoadingLogin(true)
    const response = await authLogin(dispatch, loginCreds.username, loginCreds.password)

    if (response?.success) {
      setErrorMessage('')
      setSubscriptionExpired(false)
      router.push('/log')
    } else {
      setErrorMessage(response.message)
      setSubscriptionExpired(response.subscriptionExpired)
      setLoadingLogin(false)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginCreds((prev) => ({ ...prev, username: e.target.value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginCreds((prev) => ({ ...prev, password: e.target.value }))
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

  return (
    <LoginContainer>
      <form action="POST" onSubmit={handleLogin}>
        <input
          type="text"
          name="liftclub-username"
          id="username"
          value={loginCreds.username}
          onChange={handleUsernameChange}
          placeholder="Username"
          required
          aria-label="login username"
        />

        <section className="pw-section">
          <input
            type={passwordType}
            name="password"
            id="password"
            value={loginCreds.password}
            onChange={handlePasswordChange}
            placeholder="Password"
            autoComplete="true"
            required
            aria-label="login password"
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

        <button type="submit" disabled={!Boolean(loginCreds.username.length && loginCreds.password.length)}>
          {loadingLogin ? 'Logging In' : 'Login'}
        </button>
      </form>

      {errorMessage && <p className="error-msg">{errorMessage}</p>}

      {subscriptionExpired && (
        <>
          <a href={StripePortalURL} target="_blank" className="highlight">
            Manage your Subscription
          </a>

          <hr />
        </>
      )}

      <div className="other-links">
        <Link href="/signup">Don't have an account? Sign Up</Link>
        <hr />
{/*         <DemoLoginButton setLoading={setLoadingLogin} /> */}
      </div>
    </LoginContainer>
  )
}
export default Login

export const LoginContainer = styled.div`
  text-align: center;
  margin: 1rem;
  width: 100%;
  padding: 0.5rem;

  form {
    margin-bottom: 2rem;

    input {
      width: 100%;
      margin-bottom: 1rem;
      padding: 0.5rem 0 0.25rem 0.5rem;
      font-size: 1rem;
      border: none;
      background: inherit;
      border-radius: 0;
      border: 1px solid transparent;
      border-bottom: 1px solid ${({ theme }) => theme.buttonMed};
      color: inherit;

      &:focus {
        background: ${({ theme }) => theme.darkBg};
        border: 1px solid ${({ theme }) => theme.defaultAccent};
        outline: none;
        border-radius: 5px;
      }
    }
    .pw-section {
      position: relative;

      .show-pw {
        width: fit-content;
        position: absolute;
        right: 0.5rem;
        top: 36%;
        transform: translateY(-50%);
        font-weight: 300;
        color: ${({ theme }) => theme.textLight};
        border-radius: 3px;
        background: ${({ theme }) => theme.buttonMedGradient};
        padding: 0.2rem;
        cursor: pointer;
        display: grid;
        place-items: center;
      }
      input {
        padding-right: 2.35rem;
      }
    }

    button[type='submit'] {
      padding: 0.5rem;
      width: 100%;
      font-weight: 300;
      letter-spacing: 1px;
      font-weight: 400;
      color: ${({ theme }) => theme.text};
      border: none;
      background: inherit;
      background: ${({ theme }) => theme.darkBg};
      border: 1px solid ${({ theme }) => theme.defaultAccent};
      font-size: 1rem;
      border-radius: 5px;
      transition: all 0.2s ease;

      &:disabled {
        background: transparent;
        color: ${({ theme }) => theme.textLight};
        border: 1px solid ${({ theme }) => theme.border};
      }

      &:active {
        outline: none;
      }
    }
  }

  .error-msg {
    margin-bottom: 1rem;
  }

  .other-links {
    margin-top: 5rem;

    a,
    .demo-account {
      display: block;
      font-size: 0.7rem;
      color: ${({ theme }) => theme.textLight} !important;
      background: ${({ theme }) => theme.lowOpacity};
      padding: 0.5rem 1rem;
      width: fit-content;
      margin: 1rem auto 0;
      border-radius: 5px;
      text-decoration: none;
      transition: all 0.3s ease;

      &.highlight {
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.defaultAccent};
        color: ${({ theme }) => theme.text} !important;
      }

      &:hover {
        color: ${({ theme }) => theme.text} !important;
        outline: none;
      }
    }
    .demo-account {
      margin: 0 auto;
    }

    hr {
      display: block;
      margin: 1rem auto;
      border: none;
      border-top: 1px solid ${({ theme }) => theme.border};
      width: 20%;
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
