import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Web3ReactManager from 'components/Web3ReactManager';
import NavBarContainer from './containers/NavBarContainer';
import FooterContainer from './containers/FooterContainer';
import ExchangeContainer from './containers/ExchangeContainer';
import RedeemRewardsContainer from './containers/RedeemRewardsContainer';

const App = () => {
    return (
        <Web3ReactManager>
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
        </Web3ReactManager>
    );
};

export default App;
