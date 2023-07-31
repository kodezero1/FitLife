import React from 'react'
import styled from 'styled-components'
import { StripePortalURL } from '../utils/envs'
import { ArticleStyle } from './article/[slug]'

type Props = {}

const privacy = (props: Props) => {
  return (
    <PrivacyStyles>
      <div className="content">
        <h1>Privacy Policy</h1>

        <h2>Effective date: 6th of July, 2023</h2>

        <p>
          At Lift Club, we take your privacy seriously. This Privacy Policy explains how Lift Club collects, uses, and
          safeguards your personal information when you use our web app. By using Lift Club, you consent to the data
          practices described in this policy.
        </p>

        <h3>What information do we collect?</h3>
        <p>
          The only personal information that is collected is your email address when you register for an account. That
          email address is not publicly available on the app nor through the Lift Club API. We may collect usage
          information, such as your exercise preferences and activity data, to provide personalized fitness
          recommendations.
        </p>

        <h3>How do we use your information?</h3>
        <p>The only time we will use your information is if you ask for it to be used.</p>

        <h3>How do we protect your information?</h3>
        <p>
          We implement appropriate security measures to protect your personal information from unauthorized access,
          alteration, disclosure, or destruction. We regularly review and enhance our security procedures to ensure the
          safety of your data.
        </p>

        <h3>Do we share your information?</h3>
        <p>We do not sell, trade, or rent your personal information to anyone.</p>

        <h3>Third-party links</h3>
        <p>
          Our app may contain links to third-party websites or services. We are not responsible for the privacy
          practices or the content of such websites. We encourage you to review the privacy policies of those third
          parties before providing any personal information.
        </p>
        <p>
          We use Stripe for payment processing and all payment information is managed through the Stripe customer portal{' '}
          <a href={StripePortalURL}>found here</a>.
        </p>

        <h3>Changes to this Privacy Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the revised
          policy will become effective upon posting. We encourage you to review this Privacy Policy periodically for any
          updates.
        </p>
        <p>
          If you have any questions or concerns about our Privacy Policy, please contact us using the information
          provided in the "Contact" section of our app.
        </p>
      </div>
    </PrivacyStyles>
  )
}

export default privacy

const PrivacyStyles = styled(ArticleStyle)`
  .content {
    margin-top: 6rem;

    h1 {
      font-size: 3em;
      font-weight: 800;
      line-height: 1.22;
    }
    h2 {
      font-size: 1.1rem;
      margin-bottom: 3rem;
    }

    h3 {
      margin-bottom: 2rem;
    }
  }

  @media screen and (min-width: 768px) {
    .content {
      margin-top: 8rem;
    }
  }
`
