import Branding from "../components/homepage/Branding";
import PricingSignupForm from "../components/homepage/PricingSignupForm";
import { FormContainer } from "./login";

export default function Signup() {
  return (
    <FormContainer>
      <Branding />

      <PricingSignupForm />
    </FormContainer>
  );
}
