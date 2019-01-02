import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const LiveStockDetails = ({ stock, handleStarClick, active }) => {
  return (
    <div name="live-stock-info">
      <Button icon circular compact color='black' name="watchlist-star"
        onClick={() => handleStarClick(stock.symbol, stock.companyName, stock.latestPrice)}>
        <Icon name='star' color={active ? 'blue' : 'grey'} />
      </Button>

      <h5>{stock.companyName}</h5>
      <h3>Current Price: ${stock.latestPrice}</h3>
      <i>Change: {stock.change}</i>
      <p>% Change: {(stock.changePercent * 100).toFixed(2)}%</p>
      <i>Updated {stock.latestTime}</i>
    </div>
  )
}
export default LiveStockDetails
