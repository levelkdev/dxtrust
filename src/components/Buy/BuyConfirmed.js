import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
import store from '../../stores/Root'
import { collateralType } from '../../config.json'

@observer
class BuyConfirmed extends React.Component {

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
          Confirmed
          <div className="checkboxContainer">
            <img className="checkboxIconimg" src="checkbox_758AFE.svg" />
          </div>
        </div>
        <Button active={true} onClick={() => {
          store.tradingStore.buyingState = 0;
          store.tradingStore.buyAmount = 0
        }}>Buy Again</Button>
      </div>
	  )
	}
}

export default BuyConfirmed
