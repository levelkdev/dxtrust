import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
import Loader from '../common/Loader'
import store from '../../stores/Root'
import { collateralType } from '../../config.json'

@observer
class SellUnconfirmed extends React.Component {

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
          Unconfirmed...
          <Loader size="18" />
        </div>
        <Button active={false}>Sell DXD</Button>
      </div>
	  )
	}
}

export default SellUnconfirmed
