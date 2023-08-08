import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
// Components
import Notebook from "./svg/Notebook";
import Search from "./svg/Magnifying";
import Profile from "./svg/Profile";
// import Create from "../public/navIcons/Create";
// Context
import { useUserState } from "../store";
import Builder from "./svg/Builder";

const AppNav: React.FC = () => {
  const router = useRouter();

  const { platform, user, isUsingPWA } = useUserState();

  const routes = [
    { pathname: "/log", icon: <Notebook />, title: "Log" },
    { pathname: "/builder", icon: <Builder />, title: "Build" },
    // { pathname: "/finder", icon: <Search />, title: "Find" },
    { pathname: `/users/${user!.username}`, icon: <Profile />, title: "Profile" },
  ];

  return (
    <Nav
      className={platform === "ios" && isUsingPWA ? "ios-safe-area" : ""}
      style={{ maxWidth: user ? "450px" : "100vw" }}
    >
      <NavInner>
        {routes.map(({ pathname, title, icon }) => (
          <Link href={pathname} key={title}>
            <li className={`button-press ${router.asPath.includes(pathname) && "selected"}`}>
              <span>{icon}</span>
              <p>{title}</p>
            </li>
          </Link>
        ))}
      </NavInner>
    </Nav>
  );
};
export default AppNav;

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 99;
  pointer-events: none;
  overflow: hidden;
  margin: auto;

  &.ios-safe-area {
    ul {
      padding-bottom: 1.3rem;
    }
  }
`;

const NavInner = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;

  pointer-events: none;

  padding: 0.4rem 0;
  background: ${({ theme }) => theme.navBgOpacity};
  border-top: 1px solid ${({ theme }) => theme.medOpacity};

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);

  li {
    border-radius: 5px;
    height: 50px;
    width: 80px;
    pointer-events: visible;
    cursor: pointer;
    user-select: none;

    fill: ${({ theme }) => theme.textLight};
    color: ${({ theme }) => theme.textLight};
    stroke: ${({ theme }) => theme.textLight};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    transition: all 0.2s ease;

    svg {
      margin-top: 0.2rem;
      height: 18px;
      width: 18px;
    }

    p {
      user-select: none;
      font-size: 0.5rem;
      line-height: 0.8rem;
      color: ${({ theme }) => theme.textLight};
      letter-spacing: 1px;
      margin-top: -0.2rem;
    }

    &.selected {
      background: ${({ theme }) => theme.background};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.accent};

      fill: ${({ theme }) => theme.text};
      color: ${({ theme }) => theme.text};
      stroke: ${({ theme }) => theme.text};

      p {
        color: ${({ theme }) => theme.text};
      }
    }
  }
`;
