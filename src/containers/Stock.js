import React, { Component } from 'react';
import Adapter from '../apis/Adapter'
import MarketContainer from './MarketContainer'
import EarningsContainer from './EarningsContainer'
import NewsContainer from './NewsContainer'
import StockDetailsContainer from './StockDetailsContainer'
import PeersTable from '../components/PeersTable'
import BalanceSheet from '../components/BalanceSheet'
import KeyStats from '../components/KeyStats'
import StockChart from '../components/StockChart'

class Stock extends Component {

  state = {
    symbol: this.props.match.params.symbol,
    chart: [],
    chartTimeframe: "1d",
    stock: [],
    peers: [],
    news: [],
    balanceSheet: [],
    companyInfo: [],
    earnings: [],
    keyStats: [],
    logo: null
  }

  componentDidMount() {
    this.setChart()
    this.setStock()
    this.setPeers()
    this.setNews()
    this.setBalanceSheet()
    this.setCompanyInfo()
    this.setLogo()
    this.setEarnings()
    this.setKeyStats()

    this.chartTimer = setInterval(() => this.setChart(), 60000)
    this.stockTimer = setInterval(() => this.setStock(), 1000)
    this.peersTimer = setInterval(() => this.setPeers(), 3000)
    this.newsTimer = setInterval(() => this.setNews(), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.chartTimer)
    clearInterval(this.stockTimer)
    clearInterval(this.peersTimer)
    clearInterval(this.newsTimer)
  }

  setChart() {
    Adapter.getChart(this.state.symbol, this.state.chartTimeframe)
    .then(data => this.setState({ chart: data }))
    .catch(e => console.log(e))
  }

  setStock() {
    Adapter.getStock(this.state.symbol)
    .then(data => this.setState({ stock: data }))
    .catch(e => console.log(e))
  }

  setPeers() {
    Adapter.getPeers(this.state.symbol)
    .then(data => this.setState({ peers: data }))
    .catch(e => console.log(e))
  }

  setNews() {
    Adapter.getNews(this.state.symbol)
    .then(data => this.setState({ news: data }))
    .catch(e => console.log(e))
  }

  setBalanceSheet() {
    Adapter.getBalanceSheet(this.state.symbol)
    .then(data => this.setState({ balanceSheet: data }))
    .catch(e => console.log(e))
  }

  setCompanyInfo() {
    Adapter.getCompanyInfo(this.state.symbol)
    .then(data => this.setState({ companyInfo: data }))
    .catch(e => console.log(e))
  }

  setLogo() {
    Adapter.getLogo(this.state.symbol)
    .then(data => this.setState({ logo: data.url }))
    .catch(e => console.log(e))
  }

  setEarnings() {
    Adapter.getEarnings(this.state.symbol)
    .then(data => this.setState({ earnings: data.earnings }))
    .catch(e => console.log(e))
  }

  setKeyStats() {
    Adapter.getKeyStats(this.state.symbol)
    .then(data => this.setState({ keyStats: data}))
    .catch(e => console.log(e))
  }

  changeChartTimeframe = (event) => {
    this.setState({ chartTimeframe: event.target.value }, () => this.setChart())
  }

  render() {
    return (
      <div className="stock">
        <MarketContainer marketInfo={this.props.marketInfo}/>

        {this.state.symbol} Show Page  <img src={this.state.logo} alt="" />

        <div name="live-stock-info">
          <h5>{this.state.stock.companyName}</h5>
          <h3>${this.state.stock.latestPrice}</h3>
          <i>{this.state.stock.change}</i>
          <p>{this.state.stock.changePercent}</p>
          <i>Updated {this.state.stock.latestTime}</i>
        </div>

        <StockChart
          chartData={this.state.chart}
          changeChartTimeframe={this.changeChartTimeframe}
        />
        <StockDetailsContainer
          companyInfo={this.state.companyInfo}
          stock={this.state.stock}
        />
        <KeyStats keyStats={this.state.keyStats}/>
        <EarningsContainer earnings={this.state.earnings} />
        <NewsContainer news={this.state.news}/>
        <PeersTable peers={this.state.peers}/>
        <BalanceSheet balanceSheet={this.state.balanceSheet}/>
      </div>
    )
  }
} /// End of Stock Class
export default Stock
