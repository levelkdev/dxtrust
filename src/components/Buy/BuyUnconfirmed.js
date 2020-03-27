import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
import Loader from '../common/Loader'
import store from '../../stores/Root'
import { collateralType } from '../../config.json'

@observer
class BuyUnconfirmed extends React.Component {

  constructor(props) {
      super(props)
  }

	render() {

    const { infotext } = this.props
    const price = store.tradingStore.formatPrice()
    const priceToBuy = store.tradingStore.formatPriceToBuy()
    const buyAmount = store.tradingStore.formatBuyAmount()

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
          <div className="formInfoText">{infotext}</div>
          <div>{priceToBuy} {collateralType}</div>
        </div>
        <div className="infoRow">
          <div className="formInfoText">Receive</div>
          <div>{buyAmount} DXD</div>
        </div>
        <div className="transactionStatus">
          Unconfirmed...
          <Loader size="18" />
        </div>
        <Button active={false}>Buy DXD</Button>
      </div>
	  )
	}
}

export default BuyUnconfirmed
