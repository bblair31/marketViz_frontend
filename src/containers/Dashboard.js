import React, { Component } from 'react';
import Adapter from '../apis/Adapter'
import MarketContainer from './MarketContainer'
import SectorContainer from './SectorContainer'
import GainerLoserContainer from './GainerLoserContainer'
import NewsContainer from './NewsContainer'
import EventsContainer from './EventsContainer'

class Dashboard extends Component {
  state = {
    gainers: [],
    losers: [],
    marketNews: [],
    earningsToday: [],
    iposToday: []
  }

  componentDidMount() {
    //// // TODO:  Refactor
    this.setGainers()
    this.setLosers()
    this.setMarketNews()
    this.setEarningsToday()
    this.setIpos()

    this.gainersTimer = setInterval(() => this.setGainers(), 1000)
    this.losersTimer = setInterval(() => this.setLosers(), 1000)
    this.marketNewsTimer = setInterval(() => this.setMarketNews(), 5000)
    this.earningsTodayTimer = setInterval(() => this.setEarningsToday(), 10000)
    this.iposTimer = setInterval(() => this.setIpos(), 10000)
  }

  componentWillUnmount() {
    clearInterval(this.gainersTimer)
    clearInterval(this.losersTimer)
    clearInterval(this.marketNewsTimer)
    clearInterval(this.earningsToday)
    clearInterval(this.iposTimer)
  }

  setGainers() {
    Adapter.getGainers()
    .then(data => this.setState({ gainers: data }))
    .catch(e => console.log(e))
  }

  setLosers() {
    Adapter.getLosers()
    .then(data => this.setState({ losers: data }))
    .catch(e => console.log(e))
  }

  setMarketNews() {
    Adapter.getMarketNews()
    .then(data => this.setState({ marketNews: data }))
    .catch(e => console.log(e))
  }

  setEarningsToday() {
    Adapter.getEarningsToday()
    .then(data => this.setState({ earningsToday: data }))
    .catch(e => console.log(e))
  }

  setIpos() {
    Adapter.getIpos()
    .then(data => this.setState({ iposToday: data }))
    .catch(e => console.log(e))
  }

  render() {
    return (
      <div className="dashboard"> Dashboard
        <MarketContainer
          marketInfo={this.props.marketInfo}
        />
        <SectorContainer
          sectorInfo={this.props.sectorInfo}
        />
        <GainerLoserContainer
          gainers={this.state.gainers}
          losers={this.state.losers}
         />
         <NewsContainer
           news={this.state.marketNews}
         />
         <EventsContainer
           earningsToday={this.state.earningsToday}
           iposToday={this.state.iposToday}
         />
      </div>
    )
  }
} /// End of Dashboard Class
export default Dashboard
