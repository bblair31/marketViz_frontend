import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const LiveStockDetails = ({ stock, handleStarClick, active }) => {
  return (
    <div name="live-stock-info">
      <Button icon circular compact color='black' name="watchlist-star"
        onClick={() => handleStarClick(stock.symbol, stock.companyName, stock.latestPrice)}>
        <Icon name='star' color={active ? 'blue' : 'grey'} />
      </Button>

      <h1>{stock.companyName}</h1>
      <h3>Current Price: ${(stock.latestPrice * 1).toFixed(2)}</h3>
      <i style={{color: (stock.change >=0 ? "green" : "red")}}>$ Change: {(stock.change * 1).toFixed(2)}</i>
      <p style={{color: (stock.changePercent >=0 ? "green" : "red")}}>% Change: {(stock.changePercent * 100).toFixed(2)}%</p>
      <i>Updated {stock.latestTime}</i>
    </div>
  )
}
export default LiveStockDetails
