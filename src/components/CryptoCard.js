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
      <div className="crypto-card">
        <h3>{this.props.crypto.companyName}</h3>
        <h4 style={{backgroundColor: this.checkStatus()}}>Latest Price: {this.props.crypto.latestPrice}</h4>
        <h4>Change: {this.props.crypto.change}</h4>
        <h4 style={{color: (this.props.crypto.changePercent >= 0 ? "green" : "red")}}>{(this.props.crypto.changePercent * 100).toFixed(2)}%</h4>
        <p>Updated: {this.props.crypto.latestTime}</p>
      </div>
    )
  }
}
export default CryptoCard
