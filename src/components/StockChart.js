import React from 'react'
import { Line } from 'react-chartjs-2'
import { Button } from 'semantic-ui-react'

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
          backgroundColor: '#61ffff',
          borderColor: '#61ffff',
          data: mapData(chartData),
        }]
      }
    }


const StockChart = ( { chartData, changeChartTimeframe }) => {
  return (
    <div className="stock-chart">
      <Line data={getDataObj(chartData)} />
      <Button inverted color="teal" onClick={changeChartTimeframe} value="1d">Day</Button>
      <Button inverted color="teal" onClick={changeChartTimeframe} value="1m">Month</Button>
      <Button inverted color="teal" onClick={changeChartTimeframe} value="ytd">YTD</Button>
      <Button inverted color="teal" onClick={changeChartTimeframe} value="2y">2 Year</Button>
      <Button inverted color="teal" onClick={changeChartTimeframe} value="5y">5 Year</Button>
    </div>
  )
}
export default StockChart
