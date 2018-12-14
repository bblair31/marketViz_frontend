import React, { Component } from 'react';
import './App.css';
import Adapter from './apis/Adapter'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Dashboard from './containers/Dashboard'
import Stock from './containers/Stock'

class App extends Component {
  state = {
    marketInfo: [],
    sectorInfo: [],
    selectedStock: "",
    watchlist: [],
    stockDictionary: []
  }

  componentDidMount() {
    //// // TODO:  Refactor
    this.setMarketInfo()
    this.setSectorInfo()

    this.marketInfoTimer = setInterval(() => this.setMarketInfo(), 1000)
    this.sectorInfoTimer = setInterval(() => this.setSectorInfo(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.marketInfoTimer)
    clearInterval(this.sectorInfoTimer)
  }

  setMarketInfo() {
    Adapter.getMarkets()
    .then(data => this.setState({ marketInfo: data }))
    .catch(e => console.log(e))
  }

  setSectorInfo() {
    Adapter.getSectors()
    .then(data => this.setState({ sectorInfo: data }))
    .catch(e => console.log(e))
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" render={() => <Dashboard
            marketInfo={this.state.marketInfo}
            sectorInfo={this.state.sectorInfo}
           />}
          />

          <Route path="/stocks/:symbol" render={routerProps => <Stock
            {...routerProps}
            marketInfo={this.state.marketInfo}
            sectorInfo={this.state.sectorInfo}
           />}
          />
        </div>
      </Router>
    )
  }
}

export default App;
