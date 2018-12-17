import React, { Component } from 'react';
import './App.css';
import Adapter from './apis/Adapter'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Dashboard from './containers/Dashboard'
import Stock from './containers/Stock'
import SearchBar from './components/SearchBar'

class App extends Component {
  state = {
    marketInfo: [],
    sectorInfo: [],
    selectedStock: "",
    watchlist: [],
    stockDictionary: [],
    query: "",
  }

  componentDidMount() {
    this.setMarketInfo()
    this.setSectorInfo()
    this.setStockDictionary()

    this.marketInfoTimer = setInterval(() => this.setMarketInfo(), 1000)
    this.sectorInfoTimer = setInterval(() => this.setSectorInfo(), 1000)
    this.stockDictionaryTimer = setInterval(() => this.setStockDictionary(), 1000000)
  }

  componentWillUnmount() {
    clearInterval(this.marketInfoTimer)
    clearInterval(this.sectorInfoTimer)
    clearInterval(this.stockDictionaryTimer)
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

  setStockDictionary() {
    Adapter.getStockDictionary()
    .then(data => data.map(dataObj => ({ symbol: dataObj.symbol, name: dataObj.name })))
    .then(mappedData => this.setState({ stockDictionary: mappedData }))
    .catch(e => console.log(e))
  }

  render() {
    return (
      <Router>
        <div className="App">
          <SearchBar stockDictionary={this.state.stockDictionary} />
          <Route exact path="/" render={() => <Dashboard
            marketInfo={this.state.marketInfo}
            sectorInfo={this.state.sectorInfo}
           />}
          />

          <Route path="/stocks/:symbol" render={routerProps => <Stock
            {...routerProps}
            marketInfo={this.state.marketInfo}
            sectorInfo={this.state.sectorInfo}
            key={routerProps.match.params.symbol}
           />}
          />
        </div>
      </Router>
    )
  }
}

export default App;
