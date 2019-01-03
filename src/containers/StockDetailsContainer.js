import React from 'react'
import { Grid } from 'semantic-ui-react'
import ProfileCard from '../components/ProfileCard'
import StatsCard from '../components/StatsCard'



const StockDetailsContainer = ({ companyInfo, stock }) => {
  return (
    <div className="container">
      <h2>DETAILS</h2>
      <Grid>
        <Grid.Column width={8}>
          <ProfileCard companyInfo={companyInfo} />
        </Grid.Column>
        <Grid.Column width={8}>
          <StatsCard stock={stock} />
        </Grid.Column>
      </Grid>
    </div>
  )
} /// End of StockDetailsContainer
export default StockDetailsContainer
