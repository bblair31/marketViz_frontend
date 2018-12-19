import React from 'react';
import EventCard from '../components/EventCard'
import IpoCard from '../components/IpoCard'

const renderEventCards = (eventsInfo) => {
  if (eventsInfo && eventsInfo.length > 0) {
    return eventsInfo.map(eventObj => {
      return (
        <EventCard key={eventObj.symbol} eventObj={eventObj} />
      )
    })
  } else {
    return 'None Today'
  }
}

const renderIpoCards = (iposInfo) => {
  if (iposInfo && iposInfo.length > 0) {
    return iposInfo.map(ipoObj => {
      return (
        <IpoCard key={ipoObj.Company} ipoObj={ipoObj} />
      )
    })
  } else {
    return 'None Today'
  }
}


const EventsContainer = ({ earningsToday, iposToday  }) => {
  return (
    <div className="events-container" style={{border: '5px solid green'}}>
      <h3>TODAY'S EARNINGS</h3>
      <h4>Before Open</h4>
      {renderEventCards(earningsToday.bto)}
      <h4>After Close</h4>
      {renderEventCards(earningsToday.amc)}
      <h3>TODAY'S IP0S</h3>
      {renderIpoCards(iposToday.viewData)}
    </div>
  )
} /// End of EventsContainer
export default EventsContainer
