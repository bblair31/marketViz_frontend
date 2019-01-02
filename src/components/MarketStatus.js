import React from 'react';

const MarketStatus = () => {
  let datetime = new Date()
  let day = datetime.getDay()
  let hour = datetime.getHours()
  let minute = datetime.getMinutes()

  if (day < 1 || day > 5) {
    return <div className="market-status">Market is Currently CLOSED  </div>
  } else if ((hour < 9 && minute < 30) || (hour > 16)) {
    return <div className="market-status">Market is Currently CLOSED  </div>
  } else {
    return <div className="market-status">Market is Currently OPEN  </div>
  }
} /// End of Dashboard Class
export default MarketStatus
