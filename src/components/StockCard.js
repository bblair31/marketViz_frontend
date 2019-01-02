import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const renderStarButton = (stock, handleStarClick, active) => {
  if (!!active) {
    return (
      <Button icon circular compact color='black' name="watchlist-star"
      onClick={() => handleStarClick(stock.symbol, stock.companyName, stock.latestPrice)}>
      <Icon name='star' color={active ? 'blue' : 'grey'} />
    </Button>
    )
  }
}

const StockCard = ({ stock, handleStarClick, active }) => {
  return (
    <div className="stock-card" >
      {renderStarButton(stock, handleStarClick, active)}

      <b>{stock.symbol}</b>
      <p>{stock.companyName.substring(0,20)}</p>
      <p>{(stock.changePercent * 100).toFixed(2)}%</p>
      <p>${(stock.latestPrice * 1).toFixed(2)}</p>
    </div>
  )
}
export default StockCard
