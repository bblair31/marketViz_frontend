import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import SearchBar from './SearchBar'
import { Menu } from 'semantic-ui-react'

const logo = 'https://tbncdn.freelogodesign.org/c86624f6-33f7-4d24-a887-26689680d596.png'

const Nav = ({ user, handleLogout, stockDictionary }) => {
  return (
    <Menu pointing inverted color='grey' size="huge">
      <Menu.Item>
        <img src={logo} alt='' />
      </Menu.Item>
      {user ? (
        <React.Fragment>
          <Menu.Item as={NavLink} to="/dashboard" name="Dashboard" />
          <Menu.Item as={NavLink} to="/watchlist" name="Watchlist" />
          <Menu.Item as={NavLink} to="/crypto" name="Crypto" />
          <Menu.Menu position="right">
            <Menu.Item>
              <SearchBar
                stockDictionary={stockDictionary}
                user={user}
              />
            </Menu.Item>
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
