const BASE_URL = "http://localhost:3000/api/v1";


export default class Adapter {
  static getMarkets() {
    return fetch(`${BASE_URL}/markets`)
      .then(res => res.json())
  }

  static getSectors() {
    return fetch(`${BASE_URL}/sectorperformance`)
      .then(res => res.json())
  }

  static getMostActive() {
    return fetch(`${BASE_URL}/mostactive`)
      .then(res => res.json())
  }

  static getGainers() {
    return fetch(`${BASE_URL}/gainers`)
      .then(res => res.json())
  }

  static getLosers() {
    return fetch(`${BASE_URL}/losers`)
      .then(res => res.json())
  }

  static getMarketNews() {
    return fetch(`${BASE_URL}/marketnews`)
      .then(res => res.json())
  }

  static getEarningsToday() {
    return fetch(`${BASE_URL}/earningstoday`)
      .then(res => res.json())
  }

  static getIpos() {
    return fetch(`${BASE_URL}/ipostoday`)
      .then(res => res.json())
  }

  static getChart(symbol, timeframe) {
    return fetch(`${BASE_URL}/chart/${symbol}/${timeframe}`)
      .then(res => res.json())
  }

  static getStock(symbol) {
    return fetch(`${BASE_URL}/quote/${symbol}`)
      .then(res => res.json())
  }

  static getPeers(symbol) {
    return fetch(`${BASE_URL}/peers/${symbol}`)
      .then(res => res.json())
      .then(peers => peers.map(peer => this.getStock(peer)))
  }

  static getNews(symbol) {
    return fetch(`${BASE_URL}/news/${symbol}`)
      .then(res => res.json())
  }

  static getBalanceSheet(symbol) {
    return fetch(`${BASE_URL}/financials/${symbol}`)
      .then(res => res.json())
  }

  static getCompanyInfo(symbol) {
    return fetch(`${BASE_URL}/companyinfo/${symbol}`)
      .then(res => res.json())
  }

  static getLogo(symbol) {
    return fetch(`${BASE_URL}/logo/${symbol}`)
      .then(res => res.json())
  }

  static getEarnings(symbol) {
    return fetch(`${BASE_URL}/earnings/${symbol}`)
      .then(res => res.json())
  }
} // End of Adapter Class
