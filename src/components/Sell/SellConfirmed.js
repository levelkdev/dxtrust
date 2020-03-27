import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
import store from '../../stores/Root'
import { collateralType } from '../../config.json'

@observer
class SellConfirmed extends React.Component {

	render() {
    const price = store.tradingStore.formatPrice()
    const rewardForSell = store.tradingStore.formatRewardForSell()
    const sellAmount = store.tradingStore.formatSellAmount()

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
      <div className="formWrapper">
        <div className="infoRow">
          <div className="formInfoText">Price</div>
          <div>{price} {collateralType}</div>
        </div>
        <div className="infoRow">
          <div className="formInfoText">Receive</div>
          <div>{rewardForSell} {collateralType}</div>
        </div>
        <div className="infoRow">
          <div className="formInfoText">Sell Amount</div>
          <div>{sellAmount} DXD</div>
        </div>
        <div className="transactionStatus">
          Confirmed
          <div className="checkboxContainer">
            <img className="checkboxIconimg" src="checkbox_758AFE.svg" />
          </div>
        </div>
        <Button active={true} onClick={() => {
          store.tradingStore.sellingState = 0; store.tradingStore.sellAmount = 0}
        }>Sell Again</Button>
      </div>
	  )
	}
}

export default SellConfirmed
