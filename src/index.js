// import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import App from './App'
// import rootReducer from './reducers'

const store = createStore(
  // rootReducer,
  applyMiddleware(
    thunk
  )
)

class ConnectedApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App {...this.state} />
      </Provider>
    )
  }
}

ReactDOM.render(
  <ConnectedApp />,
  document.getElementById('root')
)
