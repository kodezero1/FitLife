import styled from 'styled-components'

type Props = {
  onChange: () => any
  checked: boolean
}

const Toggle = ({ onChange, checked }: Props) => {
  return (
    <StyledLabel>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div className="toggle-control" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onChange()} />
    </StyledLabel>
  )
}

export default Toggle

const StyledLabel = styled.div`
  .toggle-control {
    transition: all 0.3s ease;
    width: calc(2.4rem + 2px);
    height: calc(1.2rem + 2px);
    display: block;
    border: 1px solid ${({ theme }) => theme.backgroundNoGrad};
    background: ${({ theme }) => theme.buttonMed};
    border-radius: 100px;
    position: relative;
    cursor: pointer;

    &:after {
      transition: all 0.3s ease;
      content: '';
      width: 1.2rem;
      height: 1.2rem;
      display: block;
      background-color: ${({ theme }) => theme.buttonLight};
      border-radius: 50%;

      position: absolute;
      top: 0px;
      left: 0px;
    }
  }

  input {
    display: none;
    &:checked + .toggle-control {
      background: ${({ theme }) => theme.buttonLight};
      &:after {
        background-color: ${({ theme }) => theme.accent};
        left: 1.2rem;
      }
    }
  }
`
