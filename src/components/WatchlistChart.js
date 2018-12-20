import React from 'react'
import { Line } from 'react-chartjs-2'

const mapLabels = (firstChart) => {
  if (firstChart) {
    debugger
    return firstChart.map(data => data.label)
  }
}
const mapData = (charts) => {
  return charts.map(data => {
    if (data.close > 0) {
      return data.close
    } else {
      return null
    }
  })
}

const getDataObj = (charts) => {
  return {
        labels: mapLabels(charts[0]),
        datasets: [{
          label: "Price",
          fill: false,
          spanGaps: true,
          lineTension: 0.2,
          pointRadius: 0,
          pointHitRadius: 10,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: mapData(charts),
        }]
      }
    }


const WatchlistChart = ( { charts, changeChartTimeframe }) => {
  return (
    <React.Fragment>
      <Line data={getDataObj(charts)} />
      <button onClick={changeChartTimeframe} value="1d">Day</button>
      <button onClick={changeChartTimeframe} value="1m">Month</button>
      <button onClick={changeChartTimeframe} value="ytd">YTD</button>
      <button onClick={changeChartTimeframe} value="2y">2 Year</button>
      <button onClick={changeChartTimeframe} value="5y">5 Year</button>
    </React.Fragment>
  )
}
export default WatchlistChart
