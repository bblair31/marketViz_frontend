const BASE_URL = "http://localhost:3000/api/v1";


export default class Adapter {

  static newUser(userData) {
    return fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(userData)
    })
  }

  static login(userData) {
    return fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(userData)
    })
  }

  static fetchCurrentUser() {
    fetch(`${BASE_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    .then(res => res.json())
    .then(console.log)
  }

  static addTransaction(foundStock, latestPrice) {
    let data = {
      symbol: foundStock.symbol,
      company_name: foundStock.name,
      iex_id: parseInt(foundStock.iexId),
      price_bought: latestPrice,
    }

    return fetch(`${BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
  }

  static destroyTransaction(symbol) {
    return fetch(`${BASE_URL}/transactions/${symbol}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(symbol)
    })
      .then(res => res.json())
  }

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

  static getStockDictionary() {
    return fetch(`${BASE_URL}/stockdictionary`)
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

  static getKeyStats(symbol) {
    return fetch(`${BASE_URL}/keystats/${symbol}`)
      .then(res => res.json())
  }

  static getCrypto() {
    return fetch(`${BASE_URL}/crypto`)
      .then(res => res.json())
  }

  static getWatchlist() {
    return fetch(`${BASE_URL}/watchlist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    .then(res => res.json())
  }

  static getWatchlistNews() {
    return fetch(`${BASE_URL}/watchlistnews`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    .then(res => res.json())
  }

  static getWatchlistPeers() {
    return fetch(`${BASE_URL}/watchlistpeers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    .then(res => res.json())
  }
} // End of Adapter Class
