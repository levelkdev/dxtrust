import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from './ActiveButton'
import InactiveButton from './InactiveButton'
import BuyInput from '../BuySell/BuyInput'
import BuySign from '../BuySell/BuySign'
import BuyUnconfirmed from '../BuySell/BuyUnconfirmed'
import BuyConfirmed from '../BuySell/BuyConfirmed'
import store from '../../stores/Root'

const ContentStates = {
  SELL_FORM: 'sell_form',
  SIGN_TRANSACTION: 'signTransaction',
  UNCOMFIRMED: 'unconfirmed',
  CONFIRMED: 'confirmed',
}

@observer
class Form extends React.Component {

  constructor(props) {
      super(props)
  }

  render() {
    const { buttontext, infotext } = this.props

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
      
      if (contentState === ContentStates.SELL_FORM) {
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

export default Form
