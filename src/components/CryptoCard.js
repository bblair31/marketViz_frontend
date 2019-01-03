import React, { Component } from 'react';

class CryptoCard extends Component {
  state = {
    flash: false
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.crypto.latestPrice !== prevProps.crypto.latestPrice) {
      this.setState({flash: true})
    } else if (this.props.crypto.latestPrice === prevProps.crypto.latestPrice && !!prevState.flash) {
      this.setState({flash: false})
    }
  }

  checkStatus = () => this.state.flash ? "lightgreen" : ""

  render() {
    return (
      <div className="crypto-card" style={{backgroundColor: this.checkStatus()}}>
        <h4>{this.props.crypto.companyName}</h4>
        <p>Latest Price: {this.props.crypto.latestPrice}</p>
        <p>Change: {this.props.crypto.change}</p>
        <p style={{color: (this.props.crypto.changePercent >= 0 ? "green" : "red")}}>{(this.props.crypto.changePercent * 100).toFixed(2)}%</p>
        <p>Updated: {this.props.crypto.latestTime}</p>
      </div>
    )
  }
}
export default CryptoCard
