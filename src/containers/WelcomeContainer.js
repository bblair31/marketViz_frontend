import React from 'react';
import Login from '../components/Login'
import Register from '../components/Register'

const WelcomeContainer = ({ successfulLogin }) => {
  return (
    <div className="welcome-container" style={{border: '5px solid green'}}>
      <h3>Welcome to MarketViz</h3>
      <Login successfulLogin={successfulLogin} />
      <h3>OR</h3>
      <Register />
    </div>
  )
} /// End of WelcomeContainer
export default WelcomeContainer
