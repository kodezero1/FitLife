import { createGlobalStyle } from 'styled-components'

import { Poppins } from '@next/font/google'

const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600'],
  style: ['normal'],
  subsets: ['latin'],
})

export const GlobalStyles = createGlobalStyle`
  :root {
    --header-height: 50px;
    --max-w-screen: 1200px;
  }

  html {
    font-family: ${poppins.style.fontFamily};
  }

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    letter-spacing: .5px;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    /* transition: all 0s linear !important; // CAUTION! REMOVES ALL ANIMATION */
    /* box-shadow: none !important; // CAUTION! REMOVES ALL BOX SHADOW */
    scroll-behavior: smooth;
    scroll-padding-top: 1rem;
  }
  
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    scroll-behavior: smooth
  }

  /* Reset button and button-style input default styles */
  input[type="submit"],
  input[type="reset"],
  input[type="button"],
  button {
    background: none;
    border: 0;
    color: inherit;
    font: inherit;
    line-height: normal;
    overflow: visible;
    padding: 0;
    -webkit-appearance: button; /* for input */
    -webkit-user-select: none; /* for button */
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  input::-moz-focus-inner,
  button::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  a:link,
  a:visited,
  a:active {
    color: inherit;
  }

  a {
    cursor: pointer;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    transition: all .1s ease;
  }

  button:active:not(:disabled) {
    box-shadow: inset 0 2px 4px ${({ theme }) => theme.boxShadow},
  inset 0 0 1px ${({ theme }) => theme.accent} !important;
  }
  .button-press:active:not(:disabled) {
    box-shadow: inset 0 2px 4px ${({ theme }) => theme.boxShadow},
  inset 0 0 1px ${({ theme }) => theme.accent} !important;
  }

  ul {
    list-style: none;
  }

  .danger {
    background: ${({ theme }) => theme.danger};
  }

  /* Heading Gradient Text */
  .heading-gradient {
    letter-spacing: 1px;
    font-weight: 500;

    background: -webkit-linear-gradient(
      -90deg,
      ${({ theme }) => theme.text},
      ${({ theme }) => theme.textLight}
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.border};
    border: 4px solid transparent;
    background-clip: content-box;   /* THIS IS IMPORTANT */
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: ${({ theme }) => theme.background};
    border: 1px solid ${({ theme }) => theme.border};
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.buttonMed};
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeInUp {
    from {
      top: 5px;
      opacity: 0;
    }
    to {
      top: 0px;
      opacity: 1;
    }
  }
  @keyframes slideUp {
    from {
      transform: translateY(7px) scale(.99);
    }
    to {
      transform: translate(0px) scale(1);
    }
  }
  @keyframes slideDown {
    from {
      transform: translateY(-7px) scale(.99);
    }
    to {
      transform: translate(0px) scale(1);
    }
  }
`
