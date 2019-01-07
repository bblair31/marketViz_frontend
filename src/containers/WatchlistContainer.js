import React, { Component } from 'react';
import Watchlist from '../components/Watchlist'
import MarketContainer from './MarketContainer'
import NewsContainer from './NewsContainer'
import Adapter from '../apis/Adapter'
// import PeersTable from '../components/PeersTable'
import WatchlistChart from '../components/WatchlistChart'

class WatchlistContainer extends Component {
  state = {
    charts: [],
    peers: [],
    news: [],
    chartTimeframe: "1d"
  }

  componentDidMount() {
    // this.setPeers()
    this.setNews()
    // this.peersTimer = setInterval(() => this.setPeers(), 1000)
    this.newsTimer = setInterval(() => this.setNews(), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.peersTimer)
    clearInterval(this.newsTimer)
  }

  // setPeers() {
  //   Adapter.getWatchlistPeers()
  //   .then(data => this.setState({peers: data}))
  //   .catch(e => console.log(e))
  // }

  setNews() {
    Adapter.getWatchlistNews()
      .then(data => this.setState({news: data}))
      .catch(e => console.log(e))
  }

  render() {
    return (
      <div className="watchlist">
        <MarketContainer marketInfo={this.props.marketInfo} />
        <Watchlist
          watchlist={this.props.watchlist}
          handleStarClick={this.props.handleStarClick}
        />
        <WatchlistChart
          watchlist={this.props.watchlist}
          sectorInfo={this.props.sectorInfo}
        />
        <NewsContainer news={this.state.news} />
        {/* <PeersTable peers={this.state.peers} /> */}
      </div>
    )
  }
} /// End of WatchlistContainer Class
export default WatchlistContainer
