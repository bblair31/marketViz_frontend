import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'
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
    return this.state.cryptos.map(crypto => {
      return (
        <Card key={crypto.symbol} style={{background: "black"}}>
          <CryptoCard key={crypto.symbol} crypto={crypto} />
        </Card>
      )
    })
  }

  render() {
    return (
      <div className="container">
        <Card.Group itemsPerRow={4} centered textAlign="center">
          {this.mapCrypto()}
        </Card.Group>
      </div>
    )
  }
} /// End of Crypto Class
export default Crypto
