import React from 'react'
import { NavLink } from 'react-router-dom'

const EventCard = ({ eventObj }) => {
  return (
    <div className="event-card">
      <h3><b><NavLink to={`/stocks/${eventObj.symbol}`}>{eventObj.symbol}</NavLink></b></h3>
      <p>{eventObj.quote.companyName}</p>
      <h3 style={eventObj.quote.change >= 0 ? {color: "#52e04a"} : {color: "red"}}>{eventObj.quote.change}</h3>
      <h3 style={eventObj.quote.change >= 0 ? {color: "#52e04a"} : {color: "red"}}>{(eventObj.quote.changePercent * 100).toFixed(2)}%</h3>
      <h4>{eventObj.headline}</h4>
      <p>Price: {eventObj.quote.latestPrice}</p>

      <p>Consensus EPS: {eventObj.consensusEPS}</p>
      <p># of Estimates: {eventObj.numberOfEstimates}</p>
      <p>Year Ago EPS: {eventObj.yearAgo}</p>
    </div>
  )
}
export default EventCard
