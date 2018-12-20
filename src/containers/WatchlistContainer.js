import React, { Component } from 'react';
import Watchlist from '../components/Watchlist'
import MarketContainer from './MarketContainer'
import NewsContainer from './NewsContainer'
import Adapter from '../apis/Adapter'
import PeersTable from '../components/PeersTable'
import WatchlistChart from '../components/WatchlistChart'
import { Line } from 'react-chartjs-2'

class WatchlistContainer extends Component {
  state = {
    charts: [],
    peers: [],
    news: [],
    chartTimeframe: "1d"
  }

  componentDidMount() {
    this.setChart()
    this.setPeers()
    this.setNews()
    this.chartTimer = setInterval(() => this.setChart(), 60000)
    this.peersTimer = setInterval(() => this.setPeers(), 1000)
    this.newsTimer = setInterval(() => this.setNews(), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.chartTimer)
    clearInterval(this.peersTimer)
    clearInterval(this.newsTimer)
  }

  setChart() {
    Adapter.getWatchlistCharts(this.state.chartTimeframe)
    .then(data => this.setState({charts: data}))
    .then(() => console.log(this.state.charts))
    .catch(e => console.log(e))
  }

  setPeers() {
    Adapter.getWatchlistPeers()
    .then(data => this.setState({peers: data}))
    .catch(e => console.log(e))
  }

  setNews() {
    Adapter.getWatchlistNews()
      .then(data => this.setState({news: data}))
      .catch(e => console.log(e))
  }

  changeChartTimeframe = (event) => {
    this.setState({ chartTimeframe: event.target.value }, () => this.setChart())
  }


  render() {
    return (
      <div className="watchlist">
        <MarketContainer marketInfo={this.props.marketInfo} />
        <WatchlistChart
          charts={this.state.charts}
          changeChartTimeframe={this.changeChartTimeframe}
        />
        <Watchlist watchlist={this.props.watchlist} />
        <NewsContainer news={this.state.news} />
        <PeersTable peers={this.state.peers} />
      </div>
    )
  }
} /// End of WatchlistContainer Class
export default WatchlistContainer
