import React from 'react'
import { Pie } from 'react-chartjs-2'

const mapSectorLabels = (watchlist) => {
  let sectors = watchlist.map(stock => stock.sector)
  return [...new Set(sectors)]
}

const countWatchlistMatches = (sector, watchlist) => {
  let count = 0
  watchlist.map(stock => {
    return sector === stock.sector ? count++ : null
  })
  return count
}

const mapChartData = (watchlist) => {
  let sectors = mapSectorLabels(watchlist)

  return sectors.map(sector => {
    return countWatchlistMatches(sector, watchlist)
  })
}

const getDataObj = (watchlist) => {
  return (
    {
    	labels: mapSectorLabels(watchlist),
    	datasets: [{
    		data: mapChartData(watchlist),
    		backgroundColor: [
    		'#FF6384',
    		'#36A2EB',
    		'#FFCE56'
    		],
    		hoverBackgroundColor: [
    		'#FF6384',
    		'#36A2EB',
    		'#FFCE56'
    		]
    	}]
    }
  )
}

const WatchlistChart = ({ watchlist, sectorInfo }) => {
  return (
    <React.Fragment>
      <Pie data={getDataObj(watchlist, sectorInfo)} />
    </React.Fragment>
  )
}
export default WatchlistChart
