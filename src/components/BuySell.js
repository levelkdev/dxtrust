import React from 'react'
import Web3 from 'web3';
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import BuyForm from './BuySell/BuyForm'
import EnableContinue from './common/EnableContinue'
import Enable from './common/Enable'
import EnablePending from './common/EnablePending'
import SellForm from './BuySell/SellForm'
import store from '../stores/Root'

const BuySellWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 298px;
  margin-left: 24px;
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  background-color: white;
  justify-content: space-between;
`

const TabWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const ActiveTab = styled.div`
  color: var(--blue-text);
  width: 50%;
  text-align: center;
  border-left: ${props => props.left ? "1px solid var(--medium-gray)" : "none"};
  padding: 15px 0px;
  cursor: pointer;
`

const InactiveTab = styled.div`
  color: var(--dark-text-gray);
  width: 50%;
  text-align: center;
  background-color: var(--light-gray);
  border-left: ${props => props.left ? "1px solid var(--medium-gray)" : "none"};
  border-bottom: 1px solid var(--medium-gray);
  border-radius: 0px 4px 0px 0px;
  padding: 15px 0px;
  cursor: pointer;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px;
`

const CryptoInfoWrapper = styled.div`
  height: 100px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  border-bottom: 1px solid var(--line-gray);
`

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 24px;
  color: var(--dark-text-gray);
`

const DXDLogo = styled.img`
`

const ETHLogo = styled.img`
`

const LogoAndText = styled.div`
  display: flex;
  flex-direction: row;
`

const LogoText = styled.div`
  margin-left: 10px;
  color: var(--light-text-gray);
`

@observer
class BuySell extends React.Component  {
  
  state = {
    currentTab: 0,
    count: 0
  }

  setCurrentTab (tabType) {
    this.setState({currentTab: tabType});
  }

  setCount = (newCount) => {
    this.setState({count: newCount})
  }

  render() {
    const { currentTab, count } = this.state
    const increment = store.tradingStore.enableState
    const ETHBalance = store.providerStore.ETHBalance ? Web3.utils.fromWei(store.providerStore.ETHBalance.toString()) : "0"
    // TODO figure out units for bonded token (dividing by a million?)
    const BondedTokenBalance = store.tradingStore.bondedTokenBalance/1000000
    
    const TabButton = ({currentTab, tabType, left, children}) => {
      if (currentTab === tabType) {
        return (
          <ActiveTab onClick={() => {this.setCurrentTab(tabType)}} left={left}>
            {children}
          </ActiveTab>
        )
      } else {
        return (
          <InactiveTab onClick={() => {this.setCurrentTab(tabType)}} left={left}>
            {children}
          </InactiveTab>
        )
      }
    }

    const CurrentForm = ({currentTab, increment}) => {
      if (currentTab === 0) {
        if (increment === 0) {
          return (
            <Enable />
          )
        } else if (increment === 1) {
          return (
            <EnablePending subtitleText="Sign Transaction..." />
          )
        } else if (increment === 2) {
          return (
            <EnablePending subtitleText="Awaiting Confirmation ..." />
          )
        } else if (increment === 3) {
          return (
            <EnableContinue />
          )
        } else {
          return (
            <BuyForm count={count} setCount={this.setCount} />
          )
        }
      } else {
        if (increment === 0) {
          return (
            <Enable />
          )
        } else if (increment === 1) {
          return (
            <EnablePending />
          )
        } else if (increment === 2) {
          return (
            <EnableContinue  />
          )
        } else {
          return (
            <SellForm count={count} setCount={this.setCount} />
          )
        }
      }
    }

    return (
      <BuySellWrapper>
        <TabWrapper>
          <TabButton currentTab={currentTab} tabType={0}>Buy</TabButton>
          <TabButton currentTab={currentTab} tabType={1} left={true}>Sell</TabButton>
        </TabWrapper>
        <ContentWrapper>
          <CryptoInfoWrapper>
            <InfoRow>
              <LogoAndText>
                <ETHLogo src="ether.svg"></ETHLogo>
                <LogoText>Ether</LogoText>
              </LogoAndText>
              <div>{ETHBalance} ETH</div>
            </InfoRow>
            <InfoRow>
              <LogoAndText>
                <DXDLogo src="dxdao-circle.svg"></DXDLogo>
                <LogoText>Dxdao</LogoText>
              </LogoAndText>
              <div>{BondedTokenBalance} DXD</div>
            </InfoRow>
          </CryptoInfoWrapper>
          <CurrentForm currentTab={currentTab} increment={increment} />
        </ContentWrapper>
      </BuySellWrapper>
    )
  }
}

export default BuySell
