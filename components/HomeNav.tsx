import Image from "next/image";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const links = [
  { title: "Articles", route: "/articles" },
  { title: "Guide", route: "/article/lift-club-guide" },
  { title: "Membership", route: "/membership" },
  // { title: "Art", route: "/art" },
];

const HomeNav = () => {
  return (
    <Nav>
      <div className="nav-inner">
        <div className="links-row">
          <Link href="/" className="logo-container">
            <Image src="/favicon.png" alt="Lift Club Logo" width={25} height={25} />
            <span>Lift Club</span>
          </Link>

          <ul className="links">
            {links.map((link) => (
              <li key={link.title}>
                <Link href={link.route}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="login">
          <Link href="/login" className="button-press">
            Log in
          </Link>
        </div>
      </div>
    </Nav>
  );
};

export default HomeNav;

const Nav = styled.nav`
  position: fixed;
  z-index: 99999;
  width: 100%;
  top: 0;
  background: transparent;
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  height: var(--header-height);

  animation: fadeIn 1s forwards;

  .nav-inner {
    border-bottom: 1px solid ${({ theme }) => theme.medOpacity};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    max-width: var(--max-w-screen);
    margin: auto;
    height: 100%;
    padding: 0 1rem;

    a {
      cursor: pointer;
      font-size: 0.95rem;
      transition: opacity 0.2s ease;
      color: ${({ theme }) => theme.text};

      &:hover {
        opacity: 0.85;
      }

      @media screen and (max-width: 600px) {
        font-size: 0.85rem;
      }
    }

    .links-row {
      display: flex;
      align-items: center;
      height: 100%;

      .logo-container {
        margin-right: 1rem;
        display: flex;
        align-items: center;

        @media screen and (max-width: 600px) {
          margin-right: 0.5rem;
        }

        span {
          margin-left: 0.5rem;
          font-weight: 500;
          font-size: 1.05rem;
          color: ${({ theme }) => theme.text} !important;

          @media screen and (max-width: 600px) {
            display: none;
          }
        }
      }
    }

    .links {
      height: 100%;
      display: flex;
      align-items: center;

      & * {
        display: flex;
        align-items: center;
        height: 100%;
      }

      a {
        padding: 0 1rem;

        @media screen and (max-width: 600px) {
          padding: 0 0.5rem;
        }
      }
    }
  }
  .login {
    display: flex;
    align-items: center;
    height: 100%;
    a {
      padding: 0.25rem 1rem;
      border-radius: 4px;
      background: ${({ theme }) => theme.medOpacity};
      border: 1px solid ${({ theme }) => theme.defaultAccent};
    }
  }
`;
