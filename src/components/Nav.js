import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const Nav = ({ user, handleLogout }) => {
  return (
    <Menu pointing secondary>
      {user ? (
        <React.Fragment>
          <Menu.Item as={NavLink} to="/dashboard" name="Dashboard" />
          <Menu.Item as={NavLink} to="/watchlist" name="Watchlist" />
          <Menu.Item as={NavLink} to="/crypto" name="Crypto" />
          <Menu.Menu position="right">
            <Menu.Item to="/logout" name="Logout" onClick={handleLogout} />
          </Menu.Menu>
        </React.Fragment>
      ) : (
        <Menu.Item as={NavLink} to="/login" name="Login" />
      )}
    </Menu>
  )
}


export default withRouter(Nav)
