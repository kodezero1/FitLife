import styled from "styled-components";
import { useRouter } from "next/router";
// Components
import LoadingSpinner from "../components/LoadingSpinner";
import WeightTile from "../components/settingsPage/WeightTile";
import TopTile from "../components/settingsPage/TopTile";
// Context
import { useUserState, useUserDispatch, logoutUser } from "../store";

export default function Settings() {
  const userDispatch = useUserDispatch();

  const { user } = useUserState();
  const router = useRouter();

  const handleLogoutClick = () => {
    logoutUser(userDispatch);
    router.push("/login");
  };

  return (
    <Container>
      {user ? (
        <>
          <TopTile />

          {/* <WeightTile /> */}

          <LogoutBtn onClick={handleLogoutClick}>Sign Out</LogoutBtn>
        </>
      ) : (
        <div className="loadingContainer">
          <LoadingSpinner />
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  & > * {
    margin-bottom: 0.5rem;
  }

  .loadingContainer {
    height: 100vh;
    display: grid;
    place-items: center;
  }

  .title {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 300;
    font-size: 1rem;
  }
`;

const LogoutBtn = styled.button`
  border-radius: 5px;
  padding: 0.75rem;
  font-size: 1rem;
  width: 100%;
  border: none;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.buttonMedGradient};
  margin: 1rem 0 2rem;
`;
