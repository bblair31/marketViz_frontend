import React, { Component } from 'react';
import MarketContainer from './MarketContainer'
import SectorContainer from './SectorContainer'

class Dashboard extends Component {

  render() {
    return (
      <div className="dashboard"> Dashboard
        <MarketContainer
          marketInfo={this.props.marketInfo}
        />
        <SectorContainer
          sectorInfo={this.props.sectorInfo}
        />
      </div>
    )
  }
} /// End of Dashboard Class
export default Dashboard
