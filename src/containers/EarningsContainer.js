import React from 'react'
import { Table } from 'semantic-ui-react'
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
    <div className="earnings-container" >
      <h2>Recent Earnings</h2>
      <Table celled inverted selectable textAlign="center">
        <tbody>
          {renderEarnings(earnings)}
        </tbody>
      </Table>
    </div>
  )
} /// End of Dashboard Class
export default EarningsContainer
