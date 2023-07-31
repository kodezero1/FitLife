import React, { useState } from 'react'
import { NextPage } from 'next'
import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import 'keen-slider/keen-slider.min.css'
import {
  KeenSliderHooks,
  KeenSliderInstance,
  KeenSliderOptions,
  SliderInstance,
  useKeenSlider,
} from 'keen-slider/react'

import { useThemeState } from '../components/Themes/useThemeState'
const ExampleExercise = dynamic(import('../components/homepage/ExampleExercise'))

import GalaxyStars from '../components/svg/GalaxyStars'
import BodyOfMuscle from '../components/svg/BodyOfMuscle'

import quickstart_dark from '../public/app-screenshots/November_2022/dark/quick-start.webp'
import logitem_dark from '../public/app-screenshots/November_2022/dark/log-item.webp'
import exercisechart_dark from '../public/app-screenshots/November_2022/dark/exercise-chart.webp'
import exerciseList_dark from '../public/app-screenshots/November_2022/dark/exercise-list.webp'
import feed_dark from '../public/app-screenshots/November_2022/dark/feed.webp'
import profile_dark from '../public/app-screenshots/November_2022/dark/profile.webp'

import quickstart_light from '../public/app-screenshots/November_2022/light/quick-start.webp'
import logitem_light from '../public/app-screenshots/November_2022/light/log-item.webp'
import exercisechart_light from '../public/app-screenshots/November_2022/light/exercise-chart.webp'
import exerciselist_light from '../public/app-screenshots/November_2022/light/exercise-list.webp'
import feed_light from '../public/app-screenshots/November_2022/light/feed.webp'
import profile_light from '../public/app-screenshots/November_2022/light/profile.webp'

import 'dotenv/config';
// const dotenv = require("dotenv").config();
// dotenv.config(`${process.env.NEXT_PUBLIC_MONGODB_URI}`);


const ImageAutoScrollRateMS = 6000

const Home: NextPage = () => {
  const { theme } = useThemeState()

  const [imageOpacities, setImageOpacities] = useState<number[]>([])

  const AppScreeshots = [
    {
      src: theme.type === 'dark' ? quickstart_dark : quickstart_light,
      alt: 'FitLife quick start page',
      priority: true,
    },
    {
      src: theme.type === 'dark' ? logitem_dark : logitem_light,
      alt: 'FitLife individual log item',
      priority: true,
    },
    {
      src: theme.type === 'dark' ? exercisechart_dark : exercisechart_light,
      alt: 'FitLife exercise chart',
    },
    {
      src: theme.type === 'dark' ? exerciseList_dark : exerciselist_light,
      alt: 'FitLife exercist list',
    },
    {
      src: theme.type === 'dark' ? feed_dark : feed_light,
      alt: 'FitLife finder page',
    },
    {
      src: theme.type === 'dark' ? profile_dark : profile_light,
      alt: 'FitLife profile page',
    },
  ]

  const autoScrollSlider = (
    slider: SliderInstance<
      KeenSliderOptions<{}, {}, KeenSliderHooks>,
      KeenSliderInstance<{}, {}, KeenSliderHooks>,
      KeenSliderHooks
    >
  ) => {
    let timeout: ReturnType<typeof setTimeout>
    let mouseOver = false

    const clearNextTimeout = () => clearTimeout(timeout)
    const nextTimeout = () => {
      clearTimeout(timeout)
      if (mouseOver) return
      timeout = setTimeout(() => slider.next(), ImageAutoScrollRateMS)
    }

    slider.on('created', () => {
      slider.container.classList.add('show')
      slider.container.addEventListener('mouseover', () => {
        mouseOver = true
        clearNextTimeout()
      })
      slider.container.addEventListener('mouseout', () => {
        mouseOver = false
        nextTimeout()
      })
      nextTimeout()
    })
    slider.on('dragStarted', clearNextTimeout)
    slider.on('animationEnded', nextTimeout)
    slider.on('updated', nextTimeout)
  }

  const [imageSliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: { perView: 1, origin: 'center' },
      breakpoints: {
        '(min-width: 768px)': { slides: { perView: 2, origin: 'center' } },
        '(min-width: 1024px)': { slides: { perView: 1, origin: 'center' } },
        '(min-width: 1220px)': { slides: { perView: 2 } },
      },
      detailsChanged(s) {
        const newOpacities = s.track.details.slides.map((slide) =>
          slide.portion > 0.5 ? slide.portion : slide.portion / 2
        )
        setImageOpacities(newOpacities)
      },
    },
    [autoScrollSlider]
  )

  const [testimonialSliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: { perView: 1 },
      breakpoints: {
        '(min-width: 650px)': { slides: { perView: 2 } },
        '(min-width: 1110px)': { slides: { perView: 3 } },
      },
    },
    [autoScrollSlider]
  )

  return (
    <>
      <Container>
        <Hero>
          <GalaxyStars />

          <HomepageText className="hero-text">
            <h1 className="heading-gradient">FitLife</h1>
            <p className="large-text">The best fitness app on the web</p>
            <br />
            <p>Access dozens of pre-made exercises, visualize your progress, share workouts, form routines and more</p>

            <Buttons>
              <Link href="/signup?plan=y">Join the Club</Link>
              <Link href="/article/lift-club-guide">User Guide</Link>
            </Buttons>
          </HomepageText>

          <SliderWrapper>
            <h1 className="heading-gradient">FitLife</h1>

            <div ref={imageSliderRef} className="keen-slider">
              {AppScreeshots.map((image, i) => (
                <div className="keen-slider__slide" key={image.alt}>
                  <div>
                    <div className="slide-image-wrap" style={{ opacity: imageOpacities[i] }}>
                      <Image src={image.src} quality={100} alt={image.alt} priority={image.priority} height={540} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SliderWrapper>
        </Hero>

        <MeteorLines>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </MeteorLines>

        <ExampleExercise />

        <TestimonialSlider ref={testimonialSliderRef} className="keen-slider">
          {Testimonials.map(({ image, name, quote }) => (
            <div className="keen-slider__slide" key={quote}>
              <div className="slide-inner">
                <p className="quote">{quote}</p>

                <div className="author">
                  {/* <Image
                    src={image.src}
                    height={image.height}
                    width={image.width}
                    alt={image.alt}
                    className="image"
                  /> */}
                  <span className="name">{name}</span>
                </div>
              </div>
            </div>
          ))}
        </TestimonialSlider>

        <Motivation>
          <div className="text-container">
            <h3 className="heading-gradient">Our Motivation</h3>
            <p>
              Aren&apos;t there enough fitness apps out there? Yeah, there are actually too many, but so many of them
              want to sell you some breakthrough workout made by the latest influencer.
            </p>
            <p>
              FitLife isn&apos;t about all that nonsense. It&apos;s about pushing your body, following your own
              intuition, and committing to bettering your life one rep at a time.
            </p>
            <p>
              There are no dieting shortcuts and no hacks to 6-pack abs. FitLife merely provides a space to discover,
              create, track, and share your fitness journey quicker and sleeker than any other app.
            </p>
          </div>

          <div className="body-container">
            <BodyOfMuscle />
          </div>
        </Motivation>

        {/* <Creed>
          <div className="box">
            <h3>Creed</h3>
            <ol type="I">
              <li>Ordinary is the enemy</li>
              <li>Membership must be paid in sweat</li>
              <li>If you said you&apos;d show up, show up</li>

              <li>Never skip leg day</li>
              <li>Always re-rack your weights</li>
              <li>Rest days are earned, not given</li>
            </ol>
          </div>
        </Creed> */}
      </Container>
    </>
  )
}

export default Home

const Container = styled.div`
  padding: 4rem 1rem;
  margin: 0 auto;
  max-width: 100%;

  background-image: radial-gradient(ellipse 70% 40% at 50% -25%, ${({ theme }) => theme.boxShadow}, transparent);

  h1 {
    font-size: 4.5rem;
  }
  h2 {
    font-size: 3.8rem;
  }
  h3 {
    font-size: 3.8rem;
  }

  @media screen and (max-width: 768px) {
    padding: var(--header-height) 1rem;

    h1 {
      font-size: 3.5rem;
    }
    h2 {
      font-size: 3rem;
    }
    h3 {
      font-size: 3rem;
    }
  }
`

const Hero = styled.section`
  max-width: var(--max-w-screen);
  width: 100%;
  min-height: 700px;
  height: 80vh;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .galaxy-stars * {
    fill: ${({ theme }) => theme.text} !important;
  }

  .hero-text {
    opacity: 0;
    animation: fadeIn 1.5s forwards;
  }

  @media screen and (max-width: 1024px) {
    flex-direction: column-reverse;
    min-height: auto;
  }
`

export const HomepageText = styled.div`
  text-align: left;
  flex: 1;
  padding-right: 2rem;

  h1,
  h2,
  h3 {
    margin-bottom: 1rem;
  }

  p {
    font-weight: 300;
    letter-spacing: 1px;
    font-size: 1.2rem;
  }

  .large-text {
    font-size: 1.5rem;
  }

  @media screen and (max-width: 1024px) {
    flex: unset;
    margin: 0rem auto 1rem;
    text-align: center;
    padding: 0;

    h1,
    h2,
    h3 {
      width: 100%;
    }
    h1 {
      display: none;
    }
    p {
      max-width: 650px;
      width: 100%;
    }
  }

  @media screen and (max-width: 768px) {
    .large-text {
      font-size: 1.3rem;
      font-weight: 400;
    }
    & > p {
      font-size: 1.1rem;
      line-height: 1.7rem;
    }
  }
`

const Buttons = styled.div`
  border-top: 1px solid ${({ theme }) => theme.defaultAccent};
  margin-top: 2rem;
  padding: 2.5rem 0;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;

  a {
    background: inherit;
    border: 1px solid ${({ theme }) => theme.defaultAccent};
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem 2rem;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 400;
    color: ${({ theme }) => theme.text};
    box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
    background: ${({ theme }) => theme.medOpacity};
  }

  @media screen and (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 0;

    a {
      margin: 0.5rem auto;
      width: 100%;
      max-width: 350px;
    }
  }
`

const SliderWrapper = styled.div`
  position: relative;
  flex: 1.25;

  img {
    height: 100% !important;
    max-height: 100%;
    width: 100%;
    max-height: 540px;

    border: 1px solid ${({ theme }) => theme.backgroundNoGrad} !important;
    border-radius: 13px;
    position: relative;
  }

  .keen-slider {
    opacity: 0;
    min-height: 472px;
    transition: opacity 1.2s ease;

    @media screen and (min-width: 1024px) {
      min-height: 540px;
    }

    &.show {
      opacity: 0;
      animation: rotateSlideIn 0.7s ease-in-out forwards 0.15s;
      will-change: transform;

      transform-style: preserve-3d;
      -webkit-transform-style: preserve-3d;
      transform: perspective(1200px) rotateX(25deg) translateY(55px);
      -webkit-transform: perspective(1200px) rotateX(25deg) translateY(55px);
      -moz-transform: perspective(1200px) rotateX(25deg) translateY(55px);
      -o-transform: perspective(1200px) rotateX(25deg) translateY(55px);
    }

    @keyframes rotateSlideIn {
      from {
        opacity: 0;

        -webkit-transform-style: preserve-3d;
        transform: perspective(1200px) rotateX(25deg) translateY(55px);
        -webkit-transform: perspective(1200px) rotateX(25deg) translateY(55px);
        -moz-transform: perspective(1200px) rotateX(25deg) translateY(55px);
        -o-transform: perspective(1200px) rotateX(25deg) translateY(55px);
      }
      to {
        opacity: 1;

        transform: translate(0);
        -webkit-transform: translate(0);
        -moz-transform: translate(0);
        -o-transform: translate(0);
        -ms-transform: translate(0);
      }
    }
  }

  .keen-slider__slide .slide-image-wrap {
    padding: 0.5rem;
    padding-bottom: 0.12rem;
    background-attachment: fixed;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.medOpacity},
      transparent 40%,
      transparent 60%,
      ${({ theme }) => theme.medOpacity}
    );
    box-shadow: 0 5px 30px -5px rgba(0, 0, 0, 0.1);
    width: fit-content;
    height: fit-content;
    margin: auto;
    border-radius: 16px;
    opacity: 0.75;
    transition: opacity 0.2s ease;
  }

  .keen-slider__slide .slide-image-wrap > span {
    overflow: visible !important;
  }
  .keen-slider__slide {
    cursor: grab;
    padding: 0 0.5rem;
    display: grid;
    place-items: center;
  }
  .keen-slider__slide:active {
    cursor: grabbing;
  }
  @media screen and (min-width: 1220px) {
    .keen-slider__slide:nth-child(odd) {
      left: 25%;
      animation: oddSlide 0.6s ease-in-out forwards 1s;
    }
    .keen-slider__slide:nth-child(even) {
      right: 25%;
      animation: evenSlide 0.6s ease-in-out forwards 1s;
    }

    @keyframes oddSlide {
      from {
        left: 25%;
      }
      to {
        left: 0%;
      }
    }
    @keyframes evenSlide {
      from {
        right: 25%;
      }
      to {
        right: 0%;
      }
    }
  }

  h1 {
    display: none;
  }

  @media screen and (min-width: 1024px) {
    max-width: 50%;

    &::after {
      background-image: radial-gradient(at 97% 21%, #3476e7 0, transparent 50%),
        radial-gradient(at 52% 99%, #9772fe 0, transparent 50%), radial-gradient(at 10% 90%, #5a65fc 0, transparent 50%),
        radial-gradient(at 33% 50%, #6d92f9 0, transparent 50%), radial-gradient(at 79% 53%, #1c4c9e 0, transparent 50%);
      position: absolute;
      top: -5%;
      left: -5%;
      content: '';
      width: 110%;
      height: 110%;
      z-index: -1;

      pointer-events: none;
      filter: blur(100px);

      /* For filter blur performance issues */
      -webkit-backface-visibility: hidden;
      -webkit-perspective: 1000;
      -webkit-transform: translate3d(0, 0, 0);
      -webkit-transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000;
      transform: translateZ(0) translate3d(0, 0, 0);

      scale: 0.3;
      opacity: 0;
      animation: scale-up 15s forwards 0.25s;

      @keyframes scale-up {
        0% {
          opacity: 0.1;
          scale: 0.3;
          rotate: 0;
        }
        3% {
          scale: 1;
          opacity: 0.25;
        }
        20% {
          scale: 1.2;
        }
        30% {
          opacity: 0.1;
        }
        40% {
          scale: 0.7;
        }
        60% {
          scale: 1.2;
        }
        100% {
          opacity: 0.2;
          scale: 1;
        }
      }
    }
  }

  @media screen and (max-width: 1024px) {
    flex: unset;
    width: calc(100% + 2.4rem);
    margin: 1rem 0 2rem;

    h1 {
      display: block;
      font-weight: 500;
      font-size: 4rem;
      margin-bottom: 1.5rem;
      letter-spacing: 1px;
    }
  }
`

const MeteorLines = styled.div`
  @media screen and (max-width: 1024px) {
    display: none !important;
  }

  position: absolute;
  top: 85vh;
  left: 10vw;
  z-index: -1;
  width: 90vw;
  height: 800px;
  transform-origin: center;
  transform: rotate(160deg) scaleX(2);

  @media screen and (min-width: 800px) {
    left: 15vw;
    width: 70vw;
  }

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .line {
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.medOpacity};
    position: relative;

    &::after {
      opacity: 0.7;
      position: absolute;
      left: 0;
      max-width: 200px;
      transform: translate(-10vw);
      content: ' ';
      width: 10vw;
      height: 100%;
      background: linear-gradient(
        to right,
        ${({ theme }) => theme.medOpacity} 0%,
        ${({ theme }) => theme.defaultAccent} 100%
      );
      animation: move 12s infinite;
      animation-fill-mode: forwards;
      animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
      will-change: transform;
    }

    &:nth-child(1)::after {
      animation-delay: 10.4s;
    }
    &:nth-child(2)::after {
      animation-delay: 0;
    }
    &:nth-child(3)::after {
      animation-delay: 3.6s;
    }
    &:nth-child(4)::after {
      animation-delay: 9s;
    }
    &:nth-child(5)::after {
      animation-delay: 6.6s;
    }
  }

  @keyframes move {
    0% {
      transform: translate(-10vw);
    }

    100% {
      transform: translate(90vw);
    }
  }
`

const TestimonialSlider = styled.section`
  position: relative;
  max-width: calc(1rem + var(--max-w-screen));
  margin: 14rem auto;
  width: 100%;
  border-radius: 7px;

  @media screen and (max-width: 768px) {
    margin: 5rem 0;
  }

  .keen-slider__slide {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    .slide-inner {
      height: 100%;
      display: grid;
      place-items: center;

      margin: 0 0.5rem;
      padding: 3rem 1rem;
      background: ${({ theme }) => theme.medOpacity};
      border-radius: 7px;

      @media screen and (min-width: 768px) {
        padding: 4rem 2rem;
      }

      .quote {
        font-size: 1.2rem;
        font-weight: 300;
      }
      .author {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        margin-top: 1rem;

        .image {
          object-fit: cover;
          border: 1px solid ${({ theme }) => theme.border};
          border-radius: 50%;
          display: block;
        }
        .name {
          color: ${({ theme }) => theme.textLight};
        }
      }
    }
  }
`

const Motivation = styled.section`
  max-width: var(--max-w-screen);
  width: 100%;
  margin: 8rem auto 4rem;
  border-radius: 10px;
  padding: 1rem;
  background: ${({ theme }) => theme.medOpacity};

  @media screen and (min-width: 768px) {
    padding: 2rem 4rem;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  & > div {
    flex: 1;
  }

  h3 {
    text-align: left;
    margin-bottom: 1rem;
  }

  p {
    text-align: left;
    margin: 0.75rem 0;
    font-weight: 300;
    letter-spacing: 1px;
    font-size: 1.2rem;
    max-width: 100%;
  }

  div:first-child {
    margin-right: 2rem;
  }

  .body-container {
    max-width: 400px;
  }
  .text-container {
  }

  svg {
    float: right;
  }

  @media screen and (max-width: 1024px) {
    p {
      max-width: 100%;
    }
    .body-container {
      flex: 0.5;
      min-height: 100%;
      max-width: unset;
    }
  }
  @media screen and (max-width: 830px) {
    .body-container {
      position: absolute;
      bottom: -100px;
      right: -50px;
      opacity: 0.3;
      height: 100px;
    }
  }
  @media screen and (max-width: 768px) {
    margin: 2rem auto;
    position: relative;

    & > div {
      max-width: 100%;
    }
    div:first-child {
      margin-right: 0;
    }

    p,
    h3 {
      text-align: center;
    }
    h3 {
      font-size: 3rem;
    }
    p {
      font-size: 1rem;
      line-height: 1.7rem;
      max-width: 100%;
      text-align: justify;
    }
  }
`

const Testimonials = [
  {
    quote: 'FitLife is more than just an app - it is a way of life.',
    image: {
      src: '/assets/vince_gironda.webp',
      height: 20,
      width: 20,
      alt: 'Default alt text',
    },
    name: 'Christian, FitLife creator',
  },
  {
    quote: 'Before FitLife, I had a physique like Belle. Now I look like Gaston.',
    image: {
      src: '/assets/vince_gironda.webp',
      height: 20,
      width: 20,
      alt: 'Default alt text',
    },
    name: 'George, FitLife member',
  },
  {
    quote: 'When life is weighing you down, FitLife taught me to do another rep.',
    image: {
      src: '/assets/vince_gironda.webp',
      height: 20,
      width: 20,
      alt: 'Default alt text',
    },
    name: 'Ryan, FitLife member',
  },
  {
    quote: 'Joining FitLife was the best decision I have ever made!',
    image: {
      src: '/assets/vince_gironda.webp',
      height: 20,
      width: 20,
      alt: 'Default alt text',
    },
    name: 'A FitLife member',
  },
  {
    quote: 'The greatest feeling you can get in the gym... is the pump.',
    image: {
      src: '/assets/vince_gironda.webp',
      height: 20,
      width: 20,
      alt: 'Default alt text',
    },
    name: 'Arnold Schwarzeneggar',
  },
  {
    quote: 'FitLife makes working out so simple and easy. Now, I just focus on lifting, and it does the rest!',
    image: {
      src: '/assets/vince_gironda.webp',
      height: 20,
      width: 20,
      alt: 'Default alt text',
    },
    name: 'George, FitLife member',
  },
]
