import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import Form from '../common/Form'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
import BuyContinue from '../Buy/BuyContinue'
import BuyInput from '../Buy/BuyInput'
import BuySign from '../Buy/BuySign'
import BuyUnconfirmed from '../Buy/BuyUnconfirmed'
import BuyConfirmed from '../Buy/BuyConfirmed'
import store from '../../stores/Root'

const ContentStates = {
  SELL_FORM: 'sell_form',
  SIGN_TRANSACTION: 'signTransaction',
  UNCOMFIRMED: 'unconfirmed',
  CONFIRMED: 'confirmed',
}

@observer
class BuyForm extends React.Component {

  render() {
    const infotext = "Pay Amount"
    const count = store.tradingStore.buyingState

    const Button = ({active, children, onClick}) => {
      if (active === true) {
        return (
          <ActiveButton onClick={onClick}>{children}</ActiveButton>
        ) 
      } else {
        return (
          <InactiveButton>{children}</InactiveButton> 
        )
      }
    }

    const Content = ({contentCount}) => {
      let contentState
      if (contentCount === 0) {
        contentState = ContentStates.SELL_FORM
      } else if (contentCount === 1) {
        contentState = ContentStates.SIGN_TRANSACTION
      } else if (contentCount ===2) {
        contentState = ContentStates.UNCONFIRMED
      } else {
        contentState = ContentStates.CONFIRMED
      }
      if (!store.providerStore.isConnected) {
        return <BuyContinue infotext={infotext} />
      } else if (contentState === ContentStates.SELL_FORM) {
        return(
          <BuyInput infotext={infotext} />
        )
      } else if (contentState === ContentStates.SIGN_TRANSACTION) {
        return(
          <BuySign infotext={infotext} />
        )
      } else if (contentState === ContentStates.UNCONFIRMED) {
        return(
          <BuyUnconfirmed infotext={infotext} />
        )
      } else if (contentState === ContentStates.CONFIRMED) {
        return(
          <BuyConfirmed infotext={infotext} />
        )
      }
    }

    return (
      <Content contentCount={count} />
    )
  }
}

export default BuyForm
