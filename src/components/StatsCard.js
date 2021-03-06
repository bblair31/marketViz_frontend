import React from 'react';
import { Grid } from 'semantic-ui-react'

const StatsCard = ({ stock }) => {
  return (
    <div className="stats-card">
      <Grid divided="vertically">
        <Grid.Row columns={2}>
          <Grid.Column>
            <p>Volume: {stock.latestVolume}</p>
            <p>Average Volume: {stock.avgTotalVolume}</p>
            <p>Open: {stock.open}</p>
            <p>52 Week Range: {stock.week52Low}-{stock.week52High}</p>
          </Grid.Column>
          <Grid.Column>
            <p>Previous Close: {stock.previousClose}</p>
            <p>Market Cap: {stock.marketCap}</p>
            <p>P/E Ratio: {stock.peRatio}</p>
            <p>YTD Change: {stock.ytdChange}</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
} /// End of Dashboard Class
export default StatsCard
