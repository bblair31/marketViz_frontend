import React from 'react';

const CryptoCard = ({ crypto }) => {
  return (
    <div className="stock-card" style={{display: "inline-block"}}>
      <b>{crypto.companyName}</b>
      <p>Symbol: {crypto.symbol}</p>
      <p>Latest Price: {crypto.latestPrice}</p>
      <p>Change: {crypto.change}</p>
      <p>{(crypto.changePercent * 100).toFixed(2)}%</p>
      <p>Updated: {crypto.latestTime}</p>
    </div>
  )
}
export default CryptoCard
