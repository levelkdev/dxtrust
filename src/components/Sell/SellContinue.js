import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import InactiveButton from '../common/InactiveButton'
import store from '../../stores/Root'
import { collateralType } from '../../config.json'

@observer
class SellInput extends React.Component {

	render() {
    const { hasError } = this.state
    const price = store.tradingStore.formatPrice()
    const rewardForSell = store.tradingStore.formatRewardForSell()

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
              Connect Wallet to proceed
            </span>
            : 
            <div/>
          }
        </div>
        <InactiveButton>Sell DXD</InactiveButton>
	  	</div>
	  )
	}
}

export default SellInput
