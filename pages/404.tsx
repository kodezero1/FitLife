import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <Wrapper>
      <Image
        src="/404_image.png"
        className="image-404"
        height={300}
        width={600}
        alt="Page not found"
      />
      <h1>404 - Page Not Found</h1>
      <span onClick={router.back} className="go-back">
        Go Back
      </span>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  height: 50vh;
  margin-top: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    margin-top: 2rem;
    font-weight: 300;
    font-size: 1.5rem;
  }

  .image-404 {
    width: 400px;
    height: 220px;
  }

  .go-back {
    cursor: w-resize;
    margin-top: 2rem;
    font-size: 1rem;
    font-weight: 300;
    border-radius: 5px;
    padding: 0.25rem 1rem;
    border: 0.5px solid ${({ theme }) => theme.defaultAccent};
    box-shadow: inset 0 0px 3px ${({ theme }) => theme.defaultAccent},
      0 2px 5px ${({ theme }) => theme.boxShadow};
    background: ${({ theme }) => theme.medOpacity};
  }
`;
