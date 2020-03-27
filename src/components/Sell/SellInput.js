import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
import store from '../../stores/Root'
import { collateralType } from '../../config.json'

@observer
class SellInput extends React.Component {
  state = {
    hasError: false
  };

  checkActive() {
    if (store.tradingStore.sellAmount > 0) {
      return true
    } else {
      return false
    }
  }

  validateNumber(value) {
    if (value > 0) {
      store.tradingStore.setSellAmount(value)
    }
    this.setState({ hasError: !(value > 0)})
  }

	render() {
    const { hasError } = this.state
    const price = store.tradingStore.formatPrice()
    const rewardForSell = store.tradingStore.formatRewardForSell()

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
      <div className="fromWrapper">
        <div className="infoRow">
          <div className="formInfoText">Price</div>
          <div>{price} {collateralType}</div>
        </div>
        <div className="infoRow">
          <div className="formInfoText">Receive</div>
          <div>{rewardForSell} {collateralType}</div>
        </div>
        <div className="inputColumn">
          <div className="formContent">
            <input className="form-vivid-blue" type="text" placeholder="0" onChange={e => this.validateNumber(e.target.value)} />
            <div>DXD</div>
          </div>
          {
            hasError ?
            <span className="errorMessage">
              Must be a positive number
            </span>
            : 
            <div/>
          }
        </div>
        <Button active={this.checkActive()} onClick={() => {
          store.tradingStore.sell(); 
          store.tradingStore.sellingState = 1
        }}>Sell DXD</Button>
	  	</div>
	  )
	}
}

export default SellInput
