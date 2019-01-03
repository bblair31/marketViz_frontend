import React from 'react'

const EarningsChart = ({ earning }) => {
  return (
    <tr key={earning.EPSReportDate}>
      <td>{earning.EPSReportDate}</td>
      <td>{earning.actualEPS}</td>
      <td>{earning.fiscalPeriod}</td>
    </tr>
  )
} /// End of Dashboard Class
export default EarningsChart
