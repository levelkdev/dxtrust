import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
import store from '../../stores/Root'
import { collateralType } from '../../config.json'

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

const PendingCircle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 10px;
  border: 1px solid var(--panel-icon-2);
`

@observer
class SellUnconfirmed extends React.Component {

	render() {
    const price = store.tradingStore.price
    const sellAmount = store.tradingStore.sellAmount
    const rewardForSell = store.tradingStore.rewardForSell

    const Button = ({active, children, onClick}) => {
      if (active === true) {
        return (
          <ActiveButton onClick={onClick}>{children}</ActiveButton>
        ) 
      } else {
        return (
          <InactiveButton onClick={onClick}>{children}</InactiveButton> 
        )
      }
    }

	  return (
      <FormWrapper>
        <InfoRow>
          <FormInfoText>Price</FormInfoText>
          <div>{price} {collateralType}</div>
        </InfoRow>
        <InfoRow>
          <FormInfoText>Receive</FormInfoText>
          <div>{rewardForSell} {collateralType}</div>
        </InfoRow>
        <InfoRow>
          <FormInfoText>Sell Amount</FormInfoText>
          <div>{sellAmount} DXD</div>
        </InfoRow>
        <Unconfirmed>
          Unconfirmed...
          <PendingCircle />
        </Unconfirmed>
        <Button active={false}>Sell DXD</Button>
      </FormWrapper>
	  )
	}
}

export default SellUnconfirmed
