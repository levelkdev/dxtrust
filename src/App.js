import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Web3ReactManager from 'components/Web3ReactManager';
import BondingCurveContainer from './containers/BondingCurveContainer';

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <div className="body-container">
            <Web3ReactManager>
              <BondingCurveContainer />
            </Web3ReactManager>
          </div>
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default App;
