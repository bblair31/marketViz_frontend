import React from 'react';
import MarketStatus from '../components/MarketStatus'
import MarketCard from '../components/MarketCard'

const renderMarketCards = (marketInfo) => {
  return marketInfo.map(market => {
    return <MarketCard key={market.mic} market={market} />
  })
}


const MarketContainer = (props) => {
  return (
    <div className="market-container">MarketContainer
      <MarketStatus />
      {renderMarketCards(props.marketInfo)}
    </div>
  )
} /// End of Dashboard Class
export default MarketContainer
