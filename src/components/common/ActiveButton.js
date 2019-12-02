import React from 'react'
import styled from 'styled-components'

const Button = styled.div`
  background-color: var(--blue-text);
  border: 1px solid var(--active-button-border);
  border-radius: 4px;
  color: white;
  height: 34px;
  line-height: 34px;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
`
const ActiveButton = ({children, onClick}) => {
  return (
    <Button onClick={onClick}>
      {children}
    </Button>
  )
}

export default ActiveButton
