import React from 'react';

const MarketStatus = () => {
  let datetime = new Date()
  let day = datetime.getDay()
  let hour = datetime.getHours()
  let minute = datetime.getMinutes()

  if (day < 1 || day > 5) {
    return <div className="market-status">Markets are currently CLOSED  </div>
  } else if ((hour <= 9) || (hour > 15) || (hour === 9 && minute < 30)) {
    return <div className="market-status">Markets are currently CLOSED  </div>
  } else {
    return <div className="market-status">Markets are currently OPEN  </div>
  }
} /// End of Dashboard Class
export default MarketStatus
