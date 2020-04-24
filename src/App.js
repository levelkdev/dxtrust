import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Web3ReactManager from 'components/Web3ReactManager';
import NavBarContainer from './containers/NavBarContainer';
import FooterContainer from './containers/FooterContainer';
import ExchangeContainer from './containers/ExchangeContainer';
import RedeemRewardsContainer from './containers/RedeemRewardsContainer';

import LandingPage from 'components/LandingPage/LandingPage';
import LandingPageFooter from 'components/LandingPage/Footer';
import LandingPageHeader from 'components/LandingPage/Header';

const App = () => {
    return (
        <HashRouter>
            <div className="app-shell">
                <Switch>
                    <Route exact path="/">
                        <Web3ReactManager>
                            <NavBarContainer />
                            <ExchangeContainer />
                            <FooterContainer />
                        </Web3ReactManager>
                    </Route>
                    <Route exact path="/landing">
                        <LandingPageHeader />
                        <LandingPage />
                        <LandingPageFooter />
                    </Route>
                </Switch>
            </div>
        </HashRouter>
    );
};

export default App;
