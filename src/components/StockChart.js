import React from 'react'
import { Line } from 'react-chartjs-2'

// average: 168.609
// changeOverTime: 0
// close: 168.56
// date: "20181214"
// high: 168.71
// label: "09:30 AM"
// low: 168.42
// marketAverage: 168.875
// marketChangeOverTime: 0
// marketClose: 168.546
// marketHigh: 169.3
// marketLow: 168.41
// marketNotional: 157140344.2966
// marketNumberOfTrades: 2616
// marketOpen: 169.27
// marketVolume: 930511
// minute: "09:30"
// notional: 700231.89
// numberOfTrades: 38
// open: 168.59
// volume: 4153

const mapLabels = (chartData) => {
  return chartData.map(data => data.label)
}
const mapData = (chartData) => {
  return chartData.map(data => {
    if (data.close > 0) {
      return data.close
    } else {
      return null
    }
  })
}

const getDataObj = (chartData) => {
  return {
        labels: mapLabels(chartData),
        datasets: [{
          label: "Price",
          fill: false,
          spanGaps: true,
          lineTension: 0.2,
          pointRadius: 0,
          pointHitRadius: 10,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: mapData(chartData),
        }]
      }
    }


const StockChart = ( { chartData, changeChartTimeframe }) => {
  return (
    <React.Fragment>
      <Line data={getDataObj(chartData)} />
      <button onClick={changeChartTimeframe} value="1d">Day</button>
      <button onClick={changeChartTimeframe} value="1m">Month</button>
      <button onClick={changeChartTimeframe} value="ytd">YTD</button>
      <button onClick={changeChartTimeframe} value="2y">2 Year</button>
      <button onClick={changeChartTimeframe} value="5y">5 Year</button>
    </React.Fragment>
  )
}
export default StockChart
