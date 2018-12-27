import React, { Component } from 'react';
import Adapter from '../apis/Adapter'
import CryptoCard from '../components/CryptoCard'


class Crypto extends Component {
  state = {
    cryptos: []
  }

  componentDidMount() {
    this.setCrypto()
    this.cryptoTimer = setInterval(() => this.setCrypto(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.cryptoTimer)
  }

  setCrypto() {
    Adapter.getCrypto()
    .then(data => this.setState({ cryptos: data }))
    .catch(e => console.log(e))
  }

  mapCrypto = () => {
    return this.state.cryptos.map(crypto =>
      <CryptoCard key={crypto.symbol} crypto={crypto} />
    )
  }

  render() {
    return (
      <div className="crypto">
        {this.mapCrypto()}
      </div>
    )
  }
} /// End of Crypto Class
export default Crypto
