import React from 'react';
import StockCard from '../components/StockCard'

const renderGLList = (stocks, handleStarClick) => {
  if (!!stocks) {
    return stocks.map(stock => {
      return <StockCard
        key={stock.symbol}
        stock={stock}
        handleStarClick={handleStarClick}
      />
    })
  }
}


const GainerLoserContainer = ({ gainers, losers, handleStarClick }) => {
  return (
    <div className="gainer-loser-container" style={{border: '5px solid gray'}}>
      <h3>GAINERS/LOSERS FOR THE DAY</h3>
      <div className="gainers" style={{border: '5px solid green'}}>GAINERS: {renderGLList(gainers, handleStarClick)}</div>
      <div className="losers" style={{border: '5px solid red'}}>LOSERS: {renderGLList(losers, handleStarClick)}</div>
    </div>
  )
} /// End of GainerLoserContainer
export default GainerLoserContainer
