import React from 'react'
import './App.css'
import ChartContainer from './containers/ChartContainer'
import TradeHistoryContainer from './containers/TradeHistoryContainer'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <ChartContainer />
        <TradeHistoryContainer />
      </div>
    )
  }
}
