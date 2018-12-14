import React from 'react';
import EventCard from '../components/EventCard'

const renderEventCards = (eventsInfo) => {
  // return eventsInfo.map(event => {
  //   return <EventCard key={event.id} event={event} />
  // })
}


const EventsContainer = ({ earningsToday, iposToday  }) => {
  return (
    <div className="events-container" style={{border: '5px solid green'}}>
      <h3>TODAY'S EARNINGS</h3>
      <h4>Before Open</h4>
      {renderEventCards(earningsToday)}
      <h4>After Close</h4>
      {renderEventCards(earningsToday)}
      <h3>TODAY'S IP0S</h3>
      {renderEventCards(iposToday)}
    </div>
  )
} /// End of Dashboard Class
export default EventsContainer
