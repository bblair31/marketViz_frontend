const BASE_URL = "http://localhost:3000/api/v1";


export default class Adapter {
  static getMarkets() {
    return fetch(`${BASE_URL}/markets`)
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
} // End of Adapter Class
