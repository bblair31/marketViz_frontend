import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const renderStarButton = (stock, handleStarClick, active) => {
  if (!!active) {
    return (
      <Button icon circular compact color='black' name="watchlist-star"
      onClick={() => handleStarClick(stock.symbol, stock.companyName, stock.latestPrice)}>
      <Icon name='star' color={active ? 'yellow' : 'grey'} />
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
      <h4 style={{color: (stock.change >=0 ? "green" : "red")}}> {(stock.change * 1).toFixed(2)}</h4>
      <h4 style={{color: (stock.changePercent >= 0 ? "green" : "red")}}>{(stock.changePercent * 100).toFixed(2)}%</h4>
      <h4>${(stock.latestPrice * 1).toFixed(2)}</h4>
    </div>
  )
}
export default StockCard
