import React from 'react'
import { Segment } from 'semantic-ui-react'
import MarketStatus from '../components/MarketStatus'
import MarketCard from '../components/MarketCard'

const renderMarketCards = (marketInfo) => {
  if (!!marketInfo) {
    return marketInfo.map(market => {
      return (
        <Segment inverted color="black" key={market.quote.symbol}>
          <MarketCard key={market.quote.symbol} market={market.quote} />
        </Segment>
      )
    })
  }
}


const MarketContainer = (props) => {
  return (
    <div className="market-container">
      <Segment.Group horizontal compact size="tiny">
        <Segment inverted color="black">
          <MarketStatus />
        </Segment>
        {renderMarketCards(props.marketInfo)}
       </Segment.Group>
    </div>
  )
} /// End of MarketContainer Class
export default MarketContainer
