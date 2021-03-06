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
import LiveStockDetails from '../components/LiveStockDetails'

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
    logo: null,
    active: false
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

  handleStarClick = (symbol, companyName, latestPrice) => {
    this.setState(prevState => {
      return {
        active: !prevState.active
      }
    })
    this.props.handleStarClick(symbol, companyName, latestPrice)
  }

  checkActive = () => {
    if (!!this.props.watchlist.length > 0) {
      return !!(this.props.watchlist.filter(stock => stock.symbol === this.state.symbol.toUpperCase()).length > 0)
    } else {
      return false
    }
  }

  render() {
    return (
      <React.Fragment>
        <MarketContainer marketInfo={this.props.marketInfo}/>
        <div className="stock">

          <img src={this.state.logo} alt="" style={{borderRadius: '25px'}} />

          <LiveStockDetails
            stock={this.state.stock}
            handleStarClick={this.handleStarClick}
            active={this.checkActive()}
           />

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
      </React.Fragment>
    )
  }
} /// End of Stock Class
export default Stock
