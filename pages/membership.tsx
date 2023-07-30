import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import Checkmark from '../components/svg/Checkmark'
import { PageHeading } from './articles'

const membership = () => {
  return (
    <Container>
      <PageHeading>
        <h1 className="heading-gradient">Membership</h1>
        <h2>Gain access to all that Lift Club has to offer</h2>
      </PageHeading>

      <CardContainer>
        <PricingCard>
          <div className="pricing-card__inner">
            <h4>Free</h4>
            <h5>$0 / month</h5>

            <hr />

            <Features>
              <ul>
                {[
                  'Progression Graphs',
                  'Unlimited Workout Logging',
                  'Workout, Routine, & Team Builder',
                  '100+ Preset Exercises and Workouts',
                ].map((feature, i) => (
                  <li key={i}>
                    <Checkmark />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Features>

            <Link href="/signup" className="button-press">
              Get Started for Free
            </Link>
          </div>
        </PricingCard>

        <PricingCard>
          <div className="pricing-card__inner">
            <h4>Standard</h4>
            <h5>
              $1 <span>/</span> month
            </h5>

            <hr />
            <Features>
              <ul>
                {[
                  'All Free Features',
                  'Custom Exercises',
                  'Ability to Create Public Workouts',
                  'Access to Members Discord channel',
                ].map((feature, i) => (
                  <li key={i}>
                    <Checkmark />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Features>

            <Link href="/signup?plan=m" className="button-press">
              Monthly Membership
            </Link>
          </div>
        </PricingCard>

        <PricingCard>
          <div className="pricing-card__inner">
            <h4>Plus</h4>
            <h5>
              $10 <span>/</span> year
            </h5>

            <hr />

            <Features>
              <ul>
                {['Same as Standard but less money'].map((feature, i) => (
                  <li key={i}>
                    <Checkmark />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Features>

            <Link href="/signup?plan=y" className="button-press">
              Yearly Membership
            </Link>
          </div>
        </PricingCard>
      </CardContainer>
    </Container>
  )
}

export default membership

const Container = styled.section`
  max-width: 1200px;
  width: 100%;
  margin: auto;
`

const Features = styled.div`
  text-align: left;
  padding: 0 1rem;
  flex: 1;

  @media screen and (min-width: 768px) {
    padding: 0;
  }

  h3 {
    color: ${({ theme }) => theme.text};
    font-weight: 400;
    font-size: 2rem;
    text-align: center;
  }

  p {
    font-weight: 300;

    em {
      font-weight: 600;
    }
  }

  ul {
    padding-left: 2rem;
    margin: 1rem 0;
    margin-left: -2.5rem;

    li {
      font-weight: 300;
      margin: 0.5rem 0;

      @media screen and (min-width: 768px) {
        margin: 1rem 0;
        font-size: 0.95rem;
      }

      svg {
        color: ${({ theme }) => theme.defaultAccent};
        margin-right: 0.6rem;
      }
    }
  }
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: stretch;
  }
`

const PricingCard = styled.div`
  flex: 1;
  padding: 0.25rem;
  background-attachment: fixed;
  background: linear-gradient(to bottom, ${({ theme }) => theme.medOpacity}, transparent 95%);
  margin: 1rem 0.5rem;
  border-radius: 16px;
  width: 100%;

  .pricing-card__inner {
    border-radius: 10px;
    padding: 2rem 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;

    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
  }

  h4 {
    font-weight: 300;
    font-size: 1.1rem;
  }

  h5 {
    font-size: 1.4rem;
    margin: 1rem 0 1.5rem;
    font-weight: 500;

    span {
      font-weight: 300;
      color: ${({ theme }) => theme.textLight};
    }
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.border};
  }

  a {
    font-size: 0.9rem;
    width: 100%;
    display: block;
    padding: 0.4rem;
    margin: 1rem 0 0;
    border-radius: 5px;
    background: ${({ theme }) => theme.medOpacity};
    border: 1px solid ${({ theme }) => theme.defaultAccent};
  }
`
