/**
 * Welcome Container - Login/Register page
 *
 * Already functional, just modernizing to TypeScript
 */
import { Divider, Grid, Segment, Header } from 'semantic-ui-react'
import Login from '../components/Login'
import Register from '../components/Register'

export function WelcomeContainer() {
  return (
    <div className="welcome-container">
      <Header
        as="h1"
        textAlign="center"
        inverted
        color="blue"
        style={{ fontSize: '60px' }}
      >
        <img
          src="https://tbncdn.freelogodesign.org/c86624f6-33f7-4d24-a887-26689680d596.png"
          alt="MarketViz Logo"
        />
        Welcome to MarketViz
      </Header>

      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
            <Login />
          </Grid.Column>
          <Grid.Column>
            <Register />
          </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
      </Segment>
    </div>
  )
}

export default WelcomeContainer
