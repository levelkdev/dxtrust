import React from 'react'
import './App.css'
import ChartContainer from './containers/ChartContainer'
import TradeHistoryContainer from './containers/TradeHistoryContainer'
import BuySellContainer from './containers/BuySellContainer'
import styled from 'styled-components'

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`

export default class App extends React.Component {
  render () {
    return (
      <PanelWrapper>
        <ChartContainer />
        <BuySellContainer />
        <TradeHistoryContainer />
      </PanelWrapper>
    )
  }
}
