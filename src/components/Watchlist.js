import React from 'react';
import StockCard from './StockCard'
import { Card } from 'semantic-ui-react'

const mapWatchlist = (watchlist, handleStarClick) => {
  return watchlist.map(stock => {
    return (
      <Card key={stock.symbol} style={{background: "#89d5ed"}}>
        <StockCard
          key={stock.symbol}
          stock={stock}
          handleStarClick={handleStarClick}
          active='true'
        />
      </Card>
    )
  })
}

const getDailyPerformance = watchlist => {
  let count = 0
  let performance = 0

  watchlist.forEach(stock => {
    performance += stock.changePercent
    count += 1
  })
  
  if (isNaN(((performance/count)*100).toFixed(2))) {
    return "Loading"
  } else {
    return ((performance/count)*100).toFixed(2)
  }
}

const getYtdPerformance = watchlist => {
  let count = 0
  let performance = 0

  watchlist.forEach(stock => {
    performance += stock.ytdChange
    count += 1
  })

  if (isNaN(((performance/count)*100).toFixed(2))) {
    return "Loading"
  } else {
    return ((performance/count)*100).toFixed(2)
  }
}


const Watchlist = ({ watchlist, handleStarClick }) => {
  return (
    <div className="container">
      <h2>Daily Performance: {getDailyPerformance(watchlist)}%</h2>
      <h2>YTD Performance: {getYtdPerformance(watchlist)}%</h2>
      <Card.Group itemsPerRow={4}>
        {mapWatchlist(watchlist, handleStarClick)}
      </Card.Group>
    </div>
  )
}
export default Watchlist
