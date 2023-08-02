import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
// Context
import { useUserDispatch, loginWithToken, useUserState, setIsUsingPWA, setPlatformToiOS } from '../store'
// Components
import SeoHead from './SeoHead'
import AppNav from './AppNav'
import HomeNav from './HomeNav'
import HomeFooter from './HomeFooter'
import DemoWelcome from './DemoWelcome'
// API
import { getAuthToken } from '../api-lib/auth/token'

const NonAppPages = {
  '/login': true,
  '/signup': true,
  '/article/[slug]': true,
  '/articles': true,
  '/membership': true,
  '/privacy': true,
  '/create-account/[session_id]': true,
  '/': true,
  '/404': true,
}

interface Props {
  children?: React.ReactNode
  title?: string
}

const Layout: React.FC<Props> = ({ title = 'FitLife', children }) => {
  const router = useRouter()
  const dispatch = useUserDispatch()
  const { user, platform, isUsingPWA, isSignedIn } = useUserState()

  const isInAppPage = !NonAppPages[router.pathname]

  const loginWithAuthToken = async (token: string) => {
    const response = await loginWithToken(dispatch, token)

    if (response.success) {
      if (router.pathname === '/login') router.push('/log')
    } else {
      if (router.pathname !== '/login') router.push('/login')
    }
  }

  useEffect(() => {
    if ((isInAppPage || router.pathname === '/login') && !isSignedIn) {
      const token = getAuthToken()
      token ? loginWithAuthToken(token) : router.push('/login')
    }
  }, [router.pathname])

  useEffect(() => {
    // Detects if device is on iOS
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    // Detects if device is in standalone mode (using downloaded PWA)
    const isPWA = 'standalone' in window.navigator && window.navigator['standalone']

    if (isIos) setPlatformToiOS(dispatch)
    if (isPWA) setIsUsingPWA(dispatch)
  }, [])

  return (
    <>
      <SeoHead title={title} />

      <MainContainer
        className={`
        ${platform === 'ios' && isUsingPWA && 'ios-safe-area'} ${isInAppPage && 'pad-bottom'}`}
        style={{ maxWidth: isInAppPage ? '450px' : '100%' }}
      >
        {!isInAppPage && <HomeNav />}

        {children}

        {isInAppPage && <DemoWelcome />}

        {user && isInAppPage && <AppNav />}

        {!isInAppPage && <HomeFooter />}
      </MainContainer>
    </>
  )
}
export default Layout

const MainContainer = styled.main`
  text-align: center;
  position: relative;
  margin: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;

  &.pad-bottom {
    padding-bottom: 3rem;
  }

  &.ios-safe-area {
    padding-bottom: 4rem;
  }
`
