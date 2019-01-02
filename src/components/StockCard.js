import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const StockCard = ({ stock, handleStarClick }) => {
  return (
    <div className="stock-card" >
      <Button icon active circular compact name="watchlist-star"
        onClick={() => handleStarClick(stock.symbol, stock.companyName, stock.latestPrice)}>
        <Icon name='star' color='blue' />
      </Button>

      <b>{stock.symbol}</b>
      <p>{stock.companyName.substring(0,20)}</p>
      <p>{(stock.changePercent * 100).toFixed(2)}%</p>
      <p>${(stock.latestPrice * 1).toFixed(2)}</p>
    </div>
  )
}
export default StockCard
