import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
import store from '../../stores/Root'

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

  checkActive() {
    if (store.tradingStore.buyAmount > 0) {
      return true
    } else {
      return false
    }
  }

	render() {

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
	  	<div>
        <FormContent>
          <input className="form-vivid-blue" type="text" placeholder="0" defaultValue={store.tradingStore.buyAmount} onChange={e => store.tradingStore.setBuyAmount(e.target.value)} />
          <div>DXD</div>
        </FormContent>
        <Button active={this.checkActive()} onClick={() => {store.tradingStore.buy()}}>Buy DXD</Button>
	  	</div>
	  )
	}
}

export default BuyInput
