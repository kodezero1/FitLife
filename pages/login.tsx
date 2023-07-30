import styled from "styled-components";
import Branding from "../components/homepage/Branding";
import LoginForm from "../components/homepage/LoginForm";

export default function Login() {
  return (
    <FormContainer>
      <Branding />

      <LoginForm />
    </FormContainer>
  );
}

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: fit-content;
  max-width: 400px;
  margin: auto;
  width: 100%;
`;
