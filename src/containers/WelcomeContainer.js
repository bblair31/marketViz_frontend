import React from 'react';
import Login from '../components/Login'
import Register from '../components/Register'
import { Divider, Grid, Segment, Header } from 'semantic-ui-react'

const WelcomeContainer = ({ successfulLogin }) => {
  return (
    <div className="welcome-container">
      <Header as='h1' textAlign='center' inverted color='blue'>
        <img src='https://tbncdn.freelogodesign.org/c86624f6-33f7-4d24-a887-26689680d596.png' alt='' />
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
