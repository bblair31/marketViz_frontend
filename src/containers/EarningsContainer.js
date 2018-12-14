import React from 'react'
import EarningsChart from '../components/EarningsChart'


const renderEarnings = (earnings) => {
  return earnings.map(earning => {
    return <EarningsChart key={earning.EPSReportDate} earning={earning} />
  })
}


const EarningsContainer = ({ earnings }) => {
  return (
    <div className="earnings-container" style={{border: '5px solid green'}}>
      <h3>Recent Earnings</h3>
      {renderEarnings(earnings)}

    </div>
  )
} /// End of Dashboard Class
export default EarningsContainer
