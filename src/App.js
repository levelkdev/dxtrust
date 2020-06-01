import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Web3ReactManager from 'components/Web3ReactManager';
import NavBarContainer from './containers/NavBarContainer';
import FooterContainer from './containers/FooterContainer';
import ExchangeContainer from './containers/ExchangeContainer';
import LandingPage from './components/LandingPage/LandingPage';
import LandingPageFooter from './components/LandingPage/Footer';
import LandingPageHeader from './components/LandingPage/Header';



import FAQPage from 'components/FAQPage';


const App = () => {
    return (
        <HashRouter>
          <Switch>
            <Route exact path="/">
            <div className="landing-body-container">
                <div className="app-shell">
                    <LandingPageHeader />
                    <LandingPage />
                    <LandingPageFooter />
                </div>
            </div>
            </Route>
            <Route exact path="/exchange">
            <div className="exchange-body-container">
                <div className="app-shell">
                  <Web3ReactManager>
                    <NavBarContainer />
                    <ExchangeContainer />
                    <FooterContainer />
                  </Web3ReactManager>
                </div>
              </div>
            </Route>
            <Route exact path="/faq">
              <div className="landing-body-container">
                <div className="app-shell">
                    <LandingPageHeader />
                    <FAQPage/>
                    <LandingPageFooter />
                </div>
              </div>
            </Route>
          </Switch>
        </HashRouter>
    );
};

export default App;
