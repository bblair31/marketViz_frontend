import React from 'react'
import EarningsChart from '../components/EarningsChart'


const renderEarnings = (earnings) => {
  if (earnings) {
    return earnings.map(earning => {
      return <EarningsChart key={earning.EPSReportDate} earning={earning} />
    })
  }
}


const EarningsContainer = ({ earnings }) => {
  return (
    <div className="container" >
      <h3>Recent Earnings</h3>
      {renderEarnings(earnings)}
    </div>
  )
} /// End of Dashboard Class
export default EarningsContainer
