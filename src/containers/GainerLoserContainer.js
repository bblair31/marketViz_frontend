import React from 'react';
import StockCard from '../components/StockCard'

const renderGLList = (stocks) => {
  return stocks.map(stock => {
    return <StockCard key={stock.symbol} stock={stock} />
  })
}


const GainerLoserContainer = ({ gainers, losers }) => {
  return (
    <div className="gainer-loser-container" style={{border: '5px solid green'}}>
      <h3>GAINERS/LOSERS FOR THE DAY</h3>
      GAINERS: {renderGLList(gainers)}<br></br>
      LOSERS: {renderGLList(losers)}
    </div>
  )
} /// End of Dashboard Class
export default GainerLoserContainer
