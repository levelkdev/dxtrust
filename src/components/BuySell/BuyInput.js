import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
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

const FormContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  color: rgba(48, 79, 254, 0.2);
  border: 1px solid rgba(48, 79, 254, 0.2);
  border-radius: 4px;
  height: 34px;
  line-height: 34px;
  margin-top: 12px;
  margin-bottom: 33px;
`

@observer
class BuyInput extends React.Component {

  constructor(props) {
      super(props)
  }

  checkActive() {
    if (store.tradingStore.buyAmount > 0) {
      return true
    } else {
      return false
    }
  }

	render() {

    const { infotext } = this.props
    const price = store.tradingStore.price
    const priceToBuy = store.tradingStore.priceToBuy

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
          <div>{price} TKN</div>
        </InfoRow>
        <InfoRow>
          <FormInfoText>{infotext}</FormInfoText>
          <div>{priceToBuy} TKN</div>
        </InfoRow>
        <FormContent>
          <input className="form-vivid-blue" type="text" placeholder="0" defaultValue={store.tradingStore.buyAmount} onChange={e => store.tradingStore.setBuyAmount(e.target.value)} />
          <div>DXD</div>
        </FormContent>
        <Button active={this.checkActive()} onClick={() => {store.tradingStore.buy(); store.tradingStore.buyingState = 1}}>Buy DXD</Button>
	  	</FormWrapper>
	  )
	}
}

export default BuyInput
