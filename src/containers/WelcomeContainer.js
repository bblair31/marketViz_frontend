import React from 'react';
import Login from '../components/Login'
import Register from '../components/Register'
import { Divider, Grid, Segment, Header } from 'semantic-ui-react'

const WelcomeContainer = ({ successfulLogin }) => {
  return (
    <div className="welcome-container">
      <Header as='h2' textAlign='center' inverted color='blue'>
        Welcome to MarketViz
      </Header>
      <Segment placeholder>
        <Grid columns={2} relaxed='very' stackable>
          <Grid.Column>
            <Login successfulLogin={successfulLogin} />
          </Grid.Column>
          <Grid.Column>
            <Register />
          </Grid.Column>

        </Grid>

        <Divider vertical>Or</Divider>
      </Segment>
    </div>
  )
} /// End of WelcomeContainer
export default WelcomeContainer
