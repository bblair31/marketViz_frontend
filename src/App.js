import React, { Component } from 'react';
import './App.css';
import Adapter from './apis/Adapter'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import Dashboard from './containers/Dashboard'
import Stock from './containers/Stock'
import WelcomeContainer from './containers/WelcomeContainer'
import SearchBar from './components/SearchBar'
import NotFound from './components/NotFound'

class App extends Component {
  state = {
    marketInfo: [],
    sectorInfo: [],
    stockDictionary: [],
    query: "",
    watchlist: [],
    user: null,
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
    .then(data => data.map(dataObj => ({ symbol: dataObj.symbol, name: dataObj.name, iexId: dataObj.iexId })))
    .then(mappedData => this.setState({ stockDictionary: mappedData }))
    .catch(e => console.log(e))
  }

  successfulLogin = ({ user, jwt }) => {
    localStorage.setItem('jwt', jwt)
    this.setState( { user }, () => this.props.history.push('/dashboard') )
  }

  handleStarClick = (symbol, companyName, latestPrice, user) => {
    let foundStock = this.state.stockDictionary.find(stock => stock.symbol === symbol)

    Adapter.addTransaction(foundStock, latestPrice, this.state.user.username)
      .then(res => res.json())
      .then(console.log)
  }

  render() {
    return (
      <div className="App">

        <SearchBar stockDictionary={this.state.stockDictionary} />

        <Switch>
          <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
          <Route path="/login" render={() => <WelcomeContainer
             successfulLogin={this.successfulLogin}
           />}
          />
          <Route path="/dashboard" render={() => <Dashboard
            marketInfo={this.state.marketInfo}
            sectorInfo={this.state.sectorInfo}
           />}
          />
          <Route exact path="/stocks/:symbol" render={routerProps => <Stock
            {...routerProps}
            marketInfo={this.state.marketInfo}
            sectorInfo={this.state.sectorInfo}
            key={routerProps.match.params.symbol}
            handleStarClick={this.handleStarClick}
           />}
          />
         <Route component={NotFound} />

        </Switch>
      </div>
    )
  }
}

export default withRouter(App);
