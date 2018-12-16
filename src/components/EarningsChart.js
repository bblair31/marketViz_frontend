import React from 'react';

const EarningsChart = ({ earning }) => {
  return (
    <div className="earnings-chart">
      {earning.EPSReportDate} -----
      {earning.actualEPS}
      {earning.fiscalPeriod}

    </div>
  )
} /// End of Dashboard Class
export default EarningsChart
