import React, { Component } from 'react';
import './App.css';
import Adapter from './apis/Adapter'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import Dashboard from './containers/Dashboard'
import Stock from './containers/Stock'
import WelcomeContainer from './containers/WelcomeContainer'
import NotFound from './components/NotFound'
import WatchlistContainer from './containers/WatchlistContainer'
import Crypto from './containers/Crypto'
import Nav from './components/Nav'
import { Segment } from 'semantic-ui-react'

class App extends Component {
  state = {
    marketInfo: [],
    sectorInfo: [],
    stockDictionary: [],
    query: "",
    watchlist: [],
    watchlistSymbols: [],
    user: null,
  }

  componentDidMount() {
    this.checkLogin()
    this.setMarketInfo()
    this.setSectorInfo()
    this.setWatchlist()
    this.setStockDictionary()

    this.marketInfoTimer = setInterval(() => this.setMarketInfo(), 1000)
    this.sectorInfoTimer = setInterval(() => this.setSectorInfo(), 1000)
    this.setWatchlistTimer = setInterval(() => this.setWatchlist(), 1000)
    this.stockDictionaryTimer = setInterval(() => this.setStockDictionary(), 1000000)
  }

  componentWillUnmount() {
    clearInterval(this.marketInfoTimer)
    clearInterval(this.sectorInfoTimer)
    clearInterval(this.setWatchlistTimer)
    clearInterval(this.stockDictionaryTimer)
  }

  setMarketInfo() {
    Adapter.getMarkets()
      .then(data => Object.values(data))
      .then(array => this.setState({ marketInfo: array }))
      .catch(e => console.log(e))
  }

  setSectorInfo() {
    Adapter.getSectors()
      .then(data => this.setState({ sectorInfo: data }))
      .catch(e => console.log(e))
  }

  setWatchlist() {
    if (this.state.user) {
      Adapter.getWatchlist()
        .then(data => this.setState({ watchlist: data }))
        .catch(e => console.log(e))
    }
  }

  setStockDictionary() {
    Adapter.getStockDictionary()
      .then(data => data.map(dataObj => ({ symbol: dataObj.symbol, name: dataObj.name, iexId: dataObj.iexId })))
      .then(mappedData => this.setState({ stockDictionary: mappedData }))
      .catch(e => console.log(e))
  }

  successfulLogin = ({ user, jwt }) => {
    localStorage.setItem('jwt', jwt)
    localStorage.setItem('user', JSON.stringify(user))
    this.setState( { user }, () => this.props.history.push('/dashboard'))
  }

  checkLogin = () => {
    if (localStorage.jwt && !this.state.user) {
      this.setState({user: JSON.parse(localStorage.user)})
    } else if (localStorage.jwt && !localStorage.user) {
      let user = Adapter.fetchCurrentUser()
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      this.props.history.push('/login')
    }
  }

  handleLogout = () => {
    localStorage.clear()
    this.setState({user: null})
    this.props.history.push('/login')
  }

  handleStarClick = (symbol, companyName, latestPrice) => {
    if (!this.state.watchlist.find(stock => stock.symbol === symbol)) {
      let foundStock = this.state.stockDictionary.find(stock => stock.symbol === symbol)

      Adapter.addTransaction(foundStock, latestPrice)
        .then(res => this.setState({ watchlist: res }))
    } else {
      Adapter.destroyTransaction(symbol)
        .then(res => {
          if (res.ok) {
            this.removeFromWatchlist(symbol)
          }
        })
    }
  }

  removeFromWatchlist = (symbol) => {
    this.setState(prevState => prevState.watchlist.filter(stock => stock.symbol !== symbol))
  }

  render() {
    return (
      <Segment>
        <Nav
          user={this.state.user}
          handleLogout={this.handleLogout}
          stockDictionary={this.state.stockDictionary}
        />

        <Switch>
          <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
          <Route path="/login" render={() => <WelcomeContainer
             successfulLogin={this.successfulLogin}
           />}
          />
          <Route path="/dashboard" render={() => <Dashboard
            marketInfo={this.state.marketInfo}
            sectorInfo={this.state.sectorInfo}
            handleStarClick={this.handleStarClick}
            watchlist={this.state.watchlist}
            />}
          />
          <Route path="/watchlist" render={() => <WatchlistContainer
            watchlist={this.state.watchlist}
            marketInfo={this.state.marketInfo}
            sectorInfo={this.state.sectorInfo}
            handleStarClick={this.handleStarClick}
            />}
          />
          <Route exact path="/stocks/:symbol" render={routerProps => <Stock
            {...routerProps}
            marketInfo={this.state.marketInfo}
            sectorInfo={this.state.sectorInfo}
            key={routerProps.match.params.symbol}
            handleStarClick={this.handleStarClick}
            watchlist={this.state.watchlist}
           />}
          />
          <Route path="/crypto" render={() => <Crypto />}
          />
         <Route component={NotFound} />
        </Switch>
      </Segment>
    )
  }
}

export default withRouter(App);
