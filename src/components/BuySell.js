import React from 'react'
import Web3 from 'web3';
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import BuyForm from './Buy/BuyForm'
import EnableContinue from './common/EnableContinue'
import Enable from './common/Enable'
import EnablePending from './common/EnablePending'
import ConnectionPending from './common/ConnectionPending'
import SellForm from './Sell/SellForm'
import store from '../stores/Root'

@observer
class BuySell extends React.Component  {
  
  state = {
    currentTab: 0,
  }

  setCurrentTab (tabType) {
    this.setState({currentTab: tabType});
  }

  render() {
    const { currentTab } = this.state
    const incrementTKN = store.tradingStore.enableTKNState
    const incrementDXD = store.tradingStore.enableDXDState
    // const ETHBalance = store.providerStore.ETHBalance ? Web3.utils.fromWei(store.providerStore.ETHBalance) : "0.000"
    const ETHBalance = store.providerStore.formatETHBalance()
    // TODO figure out units for bonded token (dividing by a million?)
    const BondedTokenBalance = store.tradingStore.formatBondedTokenBalance()
    
    const TabButton = ({currentTab, tabType, left, children}) => {
      if (currentTab === tabType) {
        return (
          <div className="activeTab" 
          style={{
            "border-left": left ? "1px solid var(--medium-gray)" : "none"
          }}
          onClick={() => {this.setCurrentTab(tabType)}} left={left}>
            {children}
          </div>
        )
      } else {
        return (
          <div className="inactiveTab"
          style={{
            "border-left": left ? "1px solid var(--medium-gray)" : "none"
          }}
          onClick={() => {this.setCurrentTab(tabType)}} left={left}>
            {children}
          </div>
        )
      }
    }

    const CurrentForm = ({currentTab, incrementTKN, incrementDXD}) => {
      if (currentTab === 0) {
        return <BuyForm />
      } else {
        if (incrementDXD === 0) {
          return (
            <Enable tokenType="DXD" />
          )
        } else if (incrementDXD === 1) {
          return (
            <EnablePending tokenType="DXD" subtitleText="Sign Transaction..." />
          )
        } else if (incrementDXD === 2) {
          return (
            <EnablePending tokenType="DXD" subtitleText="Awaiting Confirmation..." />
          )
        } else if (incrementDXD === 3) {
          return (
            <EnableContinue tokenType="DXD" />
          )
        } else {
          return (
            <SellForm />
          )
        }
      }
    }

    return (
      <div className="buySellWrapper">
        <div className="tabWrapper">
          <TabButton currentTab={currentTab} tabType={0}>Buy</TabButton>
          <TabButton currentTab={currentTab} tabType={1} left={true}>Sell</TabButton>
        </div>
        <div className="contentWrapper">
          <div className="cryptoInfoWrapper">
            <div className="infoRow">
              <div className="logoAndText">
                <img src="ether.svg"></img>
                <div className="logoText">Ether</div>
              </div>
              <div>{ETHBalance} ETH</div>
            </div>
            <div className="infoRow">
              <div className="logoAndText">
                <img src="dxdao-circle.svg"></img>
                <div className="logoText">DXdao</div>
              </div>
              <div>{BondedTokenBalance} DXD</div>
            </div>
          </div>
          <CurrentForm currentTab={currentTab} incrementTKN={incrementTKN} incrementDXD={incrementDXD} />
        </div>
      </div>
    )
  }
}

export default BuySell
