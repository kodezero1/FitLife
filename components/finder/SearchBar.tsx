import styled from "styled-components";
// Icons
import Magnifying from "../svg/Magnifying";

interface Props {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<Props> = ({ searchInput, setSearchInput }) => {
  return (
    <SearchContainer>
      <SearchInput>
        <span className="icon">
          <Magnifying />
        </span>

        <div className="input">
          <input
            type="text"
            name="add-trainer"
            placeholder="Search"
            value={searchInput}
            autoComplete="off"
            onChange={(e) =>
              setSearchInput(
                e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
              )
            }
          />

          <button
            className={`clear ${searchInput && "highlight"}`}
            onClick={() => setSearchInput("")}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </SearchInput>
    </SearchContainer>
  );
};
export default SearchBar;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem 0.25rem;
  height: 3.25rem;
  position: sticky;
  top: -2.75rem;
  z-index: 99;
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;

  .icon {
    display: grid;
    place-items: center;
    margin: 0 0.5rem 0 0.25rem;
    svg {
      fill: ${({ theme }) => theme.textLight};
      height: 18px;
      width: 18px;
    }
  }

  .input {
    flex: 1;
    border-radius: 5px;
    display: flex;
    align-items: center;
    height: 2.25rem;

    input {
      appearance: none;
      background: inherit;
      color: ${({ theme }) => theme.text};
      border: 1px solid ${({ theme }) => theme.border};
      padding: 0.25rem 0.5rem;
      width: 100%;
      margin: 0;
      font-size: 1rem;
      border-radius: 5px;

      transition: all 0.2s ease;

      &::placeholder {
        color: ${({ theme }) => theme.border};
      }

      background: ${({ theme }) => theme.lowOpacity};
      &:focus {
        background: inherit;
        background: ${({ theme }) => theme.background};

        outline: none;
        border: 1px solid ${({ theme }) => theme.accent};
      }
    }

    .clear {
      width: 2rem;
      height: 2.25rem;
      position: relative;
      cursor: pointer;

      span {
        position: absolute;
        display: block;
        height: 2px;
        width: 15px;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 3px;
        background: ${({ theme }) => theme.background};
        transition: all 0.25s ease;

        &:first-child {
          transform: rotate(45deg);
        }
        &:last-child {
          transform: rotate(-45deg);
        }
      }

      &.highlight span {
        background: ${({ theme }) => theme.textLight};
      }
    }
  }
`;
