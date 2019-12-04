import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from './ActiveButton'
import InactiveButton from './InactiveButton'
import BuyInput from '../BuySell/BuyInput'
import store from '../../stores/Root'

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

const SignTransaction = styled.div`
  // font-family: SF Pro Text;
  font-size: 15px;
  line-height: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  letter-spacing: 0.4px;
  color: var(--panel-pending);
  margin-top: 8px;
  margin-bottom: 23px;
`

const Unconfirmed = styled.div`
  // font-family: SF Pro Text;
  font-size: 15px;
  line-height: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  letter-spacing: 0.4px;
  color: var(--turquois-text);
  margin-top: 8px;
  margin-bottom: 23px;
`

const Confirmed = styled.div`
  // font-family: SF Pro Text;
  font-size: 15px;
  line-height: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.4px;
  color: var(--turquois-text);
  margin-top: 8px;
  margin-bottom: 23px;
`

const PendingCircle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 10px;
  border: 1px solid var(--panel-icon-2);
`

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 18px;
  width: 18px;
  border-radius: 10px;
  border: 1px solid var(--panel-icon-2);
`

const Checkbox = styled.img`
  height: 6px;
  width: 8px;
`

const ContentStates = {
  SELL_FORM: 'sell_form',
  SIGN_TRANSACTION: 'signTransaction',
  UNCOMFIRMED: 'unconfirmed',
  CONFIRMED: 'confirmed',
}

// const Form = ({buttontext, infotext, count, setCount}) => {
@observer
class Form extends React.Component {

  constructor(props) {
      super(props)
  }

  render() {
    const { buttontext, infotext } = this.props

    const count = store.tradingStore.buyingState

    const Button = ({active, children, onClick}) => {
      if (active === true) {
        return (
          <ActiveButton onClick={onClick}>{children}</ActiveButton>
        ) 
      } else {
        return (
          <InactiveButton>{children}</InactiveButton> 
        )
      }
    }

    const Content = ({contentCount}) => {
      let contentState
      if (contentCount === 0) {
        contentState = ContentStates.SELL_FORM
      } else if (contentCount === 1) {
        contentState = ContentStates.SIGN_TRANSACTION
      } else if (contentCount ===2) {
        contentState = ContentStates.UNCONFIRMED
      } else {
        contentState = ContentStates.CONFIRMED
      }
      
      if (contentState === ContentStates.SELL_FORM) {
        return(
          <BuyInput />
        )
      } else if (contentState === ContentStates.SIGN_TRANSACTION) {
        return(
          <div>
            <InfoRow>
              <FormInfoText>Pay Amount</FormInfoText>
              <div>100.000 DXD</div>
            </InfoRow>
            <SignTransaction>
              Sign Transaction...
              <PendingCircle />
            </SignTransaction>
            <Button active={false}>Buy DXD</Button>
          </div>
        )
      } else if (contentState === ContentStates.UNCONFIRMED) {
        return(
          <div>
            <InfoRow>
              <FormInfoText>Pay Amount</FormInfoText>
              <div>100.000 DXD</div>
            </InfoRow>
            <Unconfirmed>
              Unconfirmed...
              <PendingCircle />
            </Unconfirmed>
            <Button active={false}>Buy DXD</Button>
          </div>
        )
      } else if (contentState === ContentStates.CONFIRMED) {
        return(
          <div>
            <InfoRow>
              <FormInfoText>Pay Amount</FormInfoText>
              <div>100.000 DXD</div>
            </InfoRow>
            <Confirmed>
              Confirmed
              <CheckboxContainer>
                <Checkbox src="checkbox_758AFE.svg" />
              </CheckboxContainer>
            </Confirmed>
            <Button active={true} onClick={() => {store.tradingStore.buyingState = 0; store.tradingStore.buyAmount = 0}}>Buy Again</Button>
          </div>
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
          <FormInfoText>{infotext}</FormInfoText>
          <div>150.020 ETH</div>
        </InfoRow>
        <Content contentCount={count} />
      </FormWrapper>
    )
  }
}

export default Form
