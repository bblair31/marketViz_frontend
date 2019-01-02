import React from 'react';
import MarketStatus from '../components/MarketStatus'
import MarketCard from '../components/MarketCard'

const renderMarketCards = (marketInfo) => {
  console.log(marketInfo);
  if (!!marketInfo) {
    return marketInfo.map(market => {
      return <MarketCard key={market.quote.symbol} market={market.quote} />
    })
  }
}


const MarketContainer = (props) => {
  return (
    <div className="market-container" style={{border: '5px solid green'}}>
      <h3>MARKETS</h3>
      <MarketStatus />
      {renderMarketCards(props.marketInfo)}
    </div>
  )
} /// End of MarketContainer Class
export default MarketContainer
