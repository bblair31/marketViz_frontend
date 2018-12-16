import React from 'react';

const StatsCard = ({ stock }) => {
  return (
    <div className="stats-card" style={{display: "inline-block"}}>
      <p>Volume: {stock.volume}</p>
      <p>Average Volume: {stock.avgTotalVolume}</p>
      <p>Open: {stock.open}</p>
      <p>52 Week Range:{stock.week52Low}-{stock.week52High}</p>
      <p>Previous Close: {stock.previousClose}</p>
      <p>Market Cap: {stock.marketCap}</p>
      <p>P/E Ratio: {stock.peRatio}</p>
      <p>YTD Change: {stock.ytdChange}</p>
    </div>
  )
} /// End of Dashboard Class
export default StatsCard
