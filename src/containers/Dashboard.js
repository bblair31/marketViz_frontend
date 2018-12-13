import React, { Component } from 'react';
import MarketContainer from './MarketContainer'

class Dashboard extends Component {

  render() {
    return (
      <div className="dashboard"> Dashboard
        <MarketContainer
          marketInfo={this.props.marketInfo}
        />
      </div>
    )
  }
} /// End of Dashboard Class
export default Dashboard
