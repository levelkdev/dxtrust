import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
import store from '../../stores/Root'
import { collateralType } from '../../config.json'

@observer
class BuyInput extends React.Component {

  constructor(props) {
      super(props)
  }

  state = {
    hasError: false
  };

  checkActive() {
    if (store.tradingStore.buyAmount > 0) {
      return true
    } else {
      return false
    }
  }

  validateNumber(value) {
    if (value > 0) {
      store.tradingStore.setBuyAmount(value)
    }
    this.setState({ hasError: !(value > 0)})
  }

	render() {

    const { infotext } = this.props;
    const price = store.tradingStore.formatPrice();
    const priceToBuy = store.tradingStore.formatPriceToBuy();
    const { hasError } = this.state;

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
        <div className="inputColumn">
          <div className="formContent">
            <input 
              className="form-vivid-blue"
              type="text" 
              placeholder="0" 
              onChange={e => this.validateNumber(e.target.value)}
            />
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
          store.tradingStore.buy();
          store.tradingStore.buyingState = 1;
        }}>Buy DXD</Button>
	  	</div>
	  )
	}
}

export default BuyInput
