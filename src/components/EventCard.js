import React from 'react';

const EventCard = ({ eventObj }) => {
  return (
    <div className="event-card" style={{display: "inline-block"}}>
      <b>{eventObj.symbol}</b>
      <p>{eventObj.quote.companyName}</p>
      <p>Price: {eventObj.quote.latestPrice}</p>
      <p>Change: {eventObj.quote.change}</p>
      <p>Change %: {eventObj.quote.changePercent}</p>
      <p>{eventObj.headline}</p>
      <p>Consensus EPS: {eventObj.consensusEPS}</p>
      <p># of Estimates: {eventObj.numberOfEstimates}</p>
      <p>Year Ago EPS: {eventObj.yearAgo}</p>
    </div>
  )
}
export default EventCard
