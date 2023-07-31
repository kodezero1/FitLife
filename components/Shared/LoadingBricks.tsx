import React from "react";
import styled from "styled-components";

const LoadingBricks = () => {
  return <Bricks />;
};

export default LoadingBricks;

const Bricks = styled.div`
  position: relative;
  top: 8px;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.accent};
  box-shadow: 9991px -16px 0 0 ${({ theme }) => theme.accent},
    9991px 0 0 0 ${({ theme }) => theme.accent}, 10007px 0 0 0 ${({ theme }) => theme.accent};
  animation: dotBricks 2s infinite ease;

  @keyframes dotBricks {
    0% {
      box-shadow: 9991px -16px 0 0 ${({ theme }) => theme.accent},
        9991px 0 0 0 ${({ theme }) => theme.accent}, 10007px 0 0 0 ${({ theme }) => theme.accent};
    }
    8.333% {
      box-shadow: 10007px -16px 0 0 ${({ theme }) => theme.accent},
        9991px 0 0 0 ${({ theme }) => theme.accent}, 10007px 0 0 0 ${({ theme }) => theme.accent};
    }
    16.667% {
      box-shadow: 10007px -16px 0 0 ${({ theme }) => theme.accent},
        9991px -16px 0 0 ${({ theme }) => theme.accent},
        10007px 0 0 0 ${({ theme }) => theme.accent};
    }
    25% {
      box-shadow: 10007px -16px 0 0 ${({ theme }) => theme.accent},
        9991px -16px 0 0 ${({ theme }) => theme.accent}, 9991px 0 0 0 ${({ theme }) => theme.accent};
    }
    33.333% {
      box-shadow: 10007px 0 0 0 ${({ theme }) => theme.accent},
        9991px -16px 0 0 ${({ theme }) => theme.accent}, 9991px 0 0 0 ${({ theme }) => theme.accent};
    }
    41.667% {
      box-shadow: 10007px 0 0 0 ${({ theme }) => theme.accent},
        10007px -16px 0 0 ${({ theme }) => theme.accent},
        9991px 0 0 0 ${({ theme }) => theme.accent};
    }
    50% {
      box-shadow: 10007px 0 0 0 ${({ theme }) => theme.accent},
        10007px -16px 0 0 ${({ theme }) => theme.accent},
        9991px -16px 0 0 ${({ theme }) => theme.accent};
    }
    58.333% {
      box-shadow: 9991px 0 0 0 ${({ theme }) => theme.accent},
        10007px -16px 0 0 ${({ theme }) => theme.accent},
        9991px -16px 0 0 ${({ theme }) => theme.accent};
    }
    66.666% {
      box-shadow: 9991px 0 0 0 ${({ theme }) => theme.accent},
        10007px 0 0 0 ${({ theme }) => theme.accent},
        9991px -16px 0 0 ${({ theme }) => theme.accent};
    }
    75% {
      box-shadow: 9991px 0 0 0 ${({ theme }) => theme.accent},
        10007px 0 0 0 ${({ theme }) => theme.accent},
        10007px -16px 0 0 ${({ theme }) => theme.accent};
    }
    83.333% {
      box-shadow: 9991px -16px 0 0 ${({ theme }) => theme.accent},
        10007px 0 0 0 ${({ theme }) => theme.accent},
        10007px -16px 0 0 ${({ theme }) => theme.accent};
    }
    91.667% {
      box-shadow: 9991px -16px 0 0 ${({ theme }) => theme.accent},
        9991px 0 0 0 ${({ theme }) => theme.accent},
        10007px -16px 0 0 ${({ theme }) => theme.accent};
    }
    100% {
      box-shadow: 9991px -16px 0 0 ${({ theme }) => theme.accent},
        9991px 0 0 0 ${({ theme }) => theme.accent}, 10007px 0 0 0 ${({ theme }) => theme.accent};
    }
  }
`;
