import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
// Components
import WorkoutBuilder from "../components/builder/workout";
import RoutineBuilder from "../components/builder/routine";
import TeamBuilder from "../components/builder/team";
import BuilderSelectBar from "../components/builder/BuilderSelectBar";

const Builders = [
  { slug: "workout", component: <WorkoutBuilder /> },
  { slug: "routine", component: <RoutineBuilder /> },
  { slug: "team", component: <TeamBuilder /> },
];

export default function Builder() {
  const router = useRouter();

  const [margin, setMargin] = useState(0); // Margin for SlideContainer
  const [builderType, setBuilderType] = useState(router.query.builder?.toString() || "workout"); // 'workout' 'routine' 'team'

  // Set builder if a certain one is queried for
  useEffect(() => {
    if (router.query.builder) setBuilderType(router.query.builder.toString());
  }, [router.query]);

  // Sets margin when builder type changes
  useEffect(() => {
    switch (builderType) {
      case "workout":
        setMargin(0);
        break;
      case "routine":
        setMargin(-100);
        break;
      case "team":
        setMargin(-200);
        break;
    }
  }, [builderType]);

  return (
    <Container>
      <BuilderSelectBar builderType={builderType} setBuilderType={setBuilderType} />

      <BuilderSlideContainer style={{ marginLeft: `${margin}%` }}>
        {Builders.map(({ slug, component }, i) => (
          <div className="builder" key={i} style={builderType !== slug ? { height: "85vh" } : {}}>
            {component}
          </div>
        ))}
      </BuilderSlideContainer>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

const BuilderSlideContainer = styled.div`
  width: 300%;
  height: min-content;

  display: flex;
  align-items: flex-start;
  transition: margin 0.2s ease-out;

  .builder {
    width: 33.333%;
    padding: 0 0.5rem 1rem;
    box-sizing: content-box;
    box-sizing: border-box;
  }

  .tile {
    width: 100%;
    border-radius: 5px;
    background: ${({ theme }) => theme.background};
    margin-bottom: 0.5rem;

    h3 {
      text-align: left;
      padding: 0.5rem 0.5rem 0.25rem;
      color: ${({ theme }) => theme.textLight};
      font-weight: 300;
      font-size: 1rem;
    }
  }
`;
