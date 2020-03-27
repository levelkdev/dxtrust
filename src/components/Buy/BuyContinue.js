import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
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

	render() {

    const { infotext } = this.props;
    const price = store.tradingStore.formatPrice();
    const priceToBuy = store.tradingStore.formatPriceToBuy();
    const { hasError } = this.state;

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
            />
            <div>DXD</div>
          </div>
          <span className="errorMessage">
            Connect Wallet to proceed
          </span>
        </div>
        <InactiveButton>Buy DXD</InactiveButton> 
	  	</div>
	  )
	}
}

export default BuyInput
