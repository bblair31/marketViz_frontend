import React from 'react'
import { Card } from 'semantic-ui-react'
import EventCard from '../components/EventCard'
import IpoCard from '../components/IpoCard'

const renderEventCards = (eventsInfo) => {
  if (eventsInfo && eventsInfo.length > 0) {
    return eventsInfo.map(eventObj => {
      return (
        <Card key={eventObj.symbol} style={{background: "teal"}}>
          <EventCard key={eventObj.symbol} eventObj={eventObj} />
        </Card>
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
        <Card key={ipoObj.Company} style={{background: "teal"}}>
          <IpoCard key={ipoObj.Company} ipoObj={ipoObj} />
        </Card>
      )
    })
  } else {
    return 'None Today'
  }
}


const EventsContainer = ({ earningsToday, iposToday  }) => {
  return (
    <div className="container">
      <h2>TODAY'S EARNINGS</h2>
        <h3 style={{backgroundColor: "grey"}}>Before Open</h3>
          <Card.Group itemsPerRow={4} centered textAlign="center">
            {renderEventCards(earningsToday.bto)}
          </Card.Group>
        <h3 style={{backgroundColor: "grey"}}>After Close</h3>
          <Card.Group itemsPerRow={4} centered textAlign="center">
            {renderEventCards(earningsToday.amc)}
          </Card.Group>
        <h3 style={{backgroundColor: "grey"}}>TODAY'S IP0S</h3>
          <Card.Group itemsPerRow={4} centered textAlign="center">
            {renderIpoCards(iposToday.viewData)}
          </Card.Group>
    </div>
  )
} /// End of EventsContainer
export default EventsContainer
