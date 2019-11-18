import React from 'react'
import { createContext } from 'react'
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom'
import './App.css'
import ChartContainer from './containers/ChartContainer'
import TradeHistoryContainer from './containers/TradeHistoryContainer'
import BuySellContainer from './containers/BuySellContainer'
import NavBarContainer from './containers/NavBarContainer'
import FooterContainer from './containers/FooterContainer'
import ExchangeContainer from './containers/ExchangeContainer'
import RedeemRewardsContainer from './containers/RedeemRewardsContainer'
import store from './stores/Root'
import styled from 'styled-components'

const GlobalStore = createContext(store)

export default class App extends React.Component {
  render () {
    return (
      <GlobalStore.Provider>
        <HashRouter>
          <div className="app-shell">
            <NavBarContainer />
            <Switch>
              <Route exact path="/">
                <ExchangeContainer />
              </Route>
              <Route exact path="/exchange">
                <ExchangeContainer />
              </Route>
              <Route exact path="/redeem">
                <RedeemRewardsContainer />
              </Route>
            </Switch>
            <FooterContainer />
          </div>
        </HashRouter>
      </GlobalStore.Provider>
    )
  }
}
