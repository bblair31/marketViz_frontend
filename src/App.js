import React, { Component } from 'react';
import './App.css';
import Adapter from './apis/Adapter'

class App extends Component {
  state = {
    marketInfo: [],
    selectedStock: null
  }

  componentDidMount() {
    //// // TODO:  Refactor
    this.setMarketInfo()
    this.timer = setInterval(() => this.setMarketInfo(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  setMarketInfo() {
    Adapter.getMarkets()
    .then(data => this.setState({ marketInfo: data }))
    .catch(e => console.log(e))
  }

  render() {

    return (
      <div className="App">

      </div>
    );
  }
}

export default App;
