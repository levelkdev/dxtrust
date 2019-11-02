import React from 'react'
import styled from 'styled-components'
import ActiveButton from './ActiveButton'
import InactiveButton from './InactiveButton'

const FormWrapper = styled.div`
  height: 200px;
  padding: 6px 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 24px;
  color: var(--dark-text-gray);
  margin-bottom: 12px;
`

const FormInfoText = styled.div`
  color: var(--light-text-gray);
`

const FormContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  color: rgba(48, 79, 254, 0.2);
  border: 1px solid rgba(48, 79, 254, 0.2);
  border-radius: 4px;
  height: 34px;
  line-height: 34px;
  margin-top: 12px;
  margin-bottom: 33px;
`


const Form = ({buttontext}) => {
  

  const Button = ({active, children}) => {
    if (active === true) {
      return (
        <ActiveButton>{children}</ActiveButton>
      ) 
    } else {
      return (
        <InactiveButton>{children}</InactiveButton>
      )
    }
  }

  return (
    <FormWrapper>
      <InfoRow>
        <FormInfoText>Price</FormInfoText>
        <div>1.502 DXD/ETH</div>
      </InfoRow>
      <InfoRow>
        <FormInfoText>Pay Amount</FormInfoText>
        <div>150.020 ETH</div>
      </InfoRow>
      <FormContent>
        <div className="form-vivid-blue">100</div>
        <div>DXD</div>
      </FormContent>
      <Button active={false}>{buttontext}</Button>
    </FormWrapper>
  )
}

export default Form
