import { matchSorter } from 'match-sorter'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import Expand from '../svg/Expand'
import TextInput from './TextInput'

interface Params<T> {
  listName: string
  keyProp: string
  items: T[] | undefined
  onItemClick: (item: T) => any
  displayProp: string
  onDeleteClick?: (item: T) => any
  isHighlighted?: (item: T) => boolean
  isLoading?: (item: T) => boolean
  searchTerm?: string
  searchProps?: (string | ((item: T) => string[]))[]
  showSearch?: boolean
  showExpand?: boolean
  title?: string
  maxRows?: number
}

export function TiledList<T>({
  listName,
  keyProp,
  items = [],
  onItemClick,
  displayProp,
  onDeleteClick,
  isHighlighted,
  isLoading,
  searchTerm = '',
  searchProps,
  showSearch = false,
  showExpand = false,
  title,
  maxRows = 3,
}: Params<T>) {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [internalSearchTerm, setInternalSearchTerm] = useState('')

  if (!searchProps && items && items[0] && typeof items[0] === 'object') {
    searchProps = Object.keys(items[0])
  }

  const displayedItems = useMemo(() => {
    return searchTerm || internalSearchTerm
      ? matchSorter(items, searchTerm || internalSearchTerm, { keys: searchProps })
      : items
  }, [searchTerm, internalSearchTerm, items])

  const handleDeleteClick = (e, item: T) => {
    e.stopPropagation()
    onDeleteClick && onDeleteClick(item)
  }

  return (
    <Container className="tiled-list">
      {(title || showExpand) && (
        <Controls>
          <h3 className="tiled-list-title">{title}</h3>

          {showExpand && (
            <div className={`button-press ${expanded && 'expanded'}`} onClick={() => setExpanded(!expanded)}>
              <Expand />
            </div>
          )}
        </Controls>
      )}

      {showSearch &&
        (searchTerm ? (
          <p className="default-searched-text">
            Searching for: <span>{searchTerm}</span>
          </p>
        ) : (
          <TextInput onChange={(text) => setInternalSearchTerm(text)} inputName={''} />
        ))}

      <List count={displayedItems.length} expanded={expanded} maxRows={maxRows}>
        {displayedItems.length ? (
          displayedItems.map((item, i) => (
            <li
              style={{ animationDelay: i / 30 + 's' }}
              key={listName + item[keyProp]}
              onClick={() => onItemClick(item)}
              className={`button-press ${isHighlighted && isHighlighted(item) && 'highlight '}
          ${isLoading && isLoading(item) && 'loading'}`}
            >
              <span>{item[displayProp]}</span>
              {onDeleteClick && <button onClick={(e) => handleDeleteClick(e, item)}>✕</button>}
            </li>
          ))
        ) : (
          <p className="fallback-text">None</p>
        )}
      </List>
    </Container>
  )
}
export default TiledList

const Container = styled.div`
  .default-searched-text {
    text-align: left;
    margin: 0.25rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
    span {
      font-weight: 400;
    }
  }
`

const Controls = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;

  h3 {
    flex: 1;
    text-align: left;
    margin: 0.25rem 0;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
    font-size: 1rem;
  }

  .button-press {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.textLight};
    margin: 0 0.25rem;
    display: grid;
    place-items: center;
    border-radius: 4px;
    padding: 0.25rem;
    transition: all 0.2s ease;

    svg {
      height: 1rem;
      width: 1rem;
    }

    &.expanded {
      background: ${({ theme }) => theme.buttonMed};
      color: ${({ theme }) => theme.text};
    }
  }
`

const List = styled.ul<{ count: number; expanded: boolean; maxRows: number }>`
  width: 100%;
  overflow-x: auto;
  transition: all 0.3s ease;
  padding-top: 2px;

  /* -ms-overflow-style: none; 
  scrollbar-width: none; 
  &::-webkit-scrollbar {
    display: none; 
  } */

  display: grid;
  grid-auto-flow: column;

  grid-template-rows: repeat(${({ count, maxRows }) => Math.min(maxRows, count)}, 1fr);
  grid-template-columns: repeat(
    ${({ count, maxRows }) => Math.ceil(count / maxRows)},
    ${({ expanded, count, maxRows }) => (expanded ? '100%' : count > 2 * maxRows ? '49.5%' : '50%')}
  );

  li {
    background: ${({ theme }) => theme.buttonMedGradient};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.border}, 0 1px 3px ${({ theme }) => theme.boxShadow};

    border-radius: 4px;
    cursor: pointer;
    padding: 0.5rem;
    margin: 0 0.25rem 0.5rem;
    text-align: left;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    font-weight: 400;
    position: relative;
    opacity: 0;
    overflow: hidden;
    animation: fadeIn 0.3s forwards;

    span {
      flex: 1;
      font-size: 0.95rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    button {
      font-size: 0.75rem;
      font-weight: 600;
      color: ${({ theme }) => theme.textLight};
      border: none;
      border-radius: 3px;
      margin-left: 0.75rem;
      margin-right: -0.25rem;
      height: 25px;
      width: 25px;
      min-width: 25px;
      display: grid;
      place-items: center;
      transition: all 0.25s ease;
    }

    &.highlight {
      background: ${({ theme }) => theme.accent};
      color: ${({ theme }) => theme.accentText};

      button {
        color: ${({ theme }) => theme.accentText};
      }
    }

    &.loading {
      background: ${({ theme }) => theme.buttonMed};
      button {
        background: transparent;
      }

      &::after {
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-position: center;
        background-image: linear-gradient(
          90deg,
          ${({ theme }) => theme.buttonMed} 0,
          ${({ theme }) => theme.medOpacity} 20%,
          ${({ theme }) => theme.medOpacity} 60%
        );
        animation-name: shimmer;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        content: '';
      }
      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
    }
  }

  .fallback-text {
    width: fit-content;
    padding: 0 1rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
  }
`
