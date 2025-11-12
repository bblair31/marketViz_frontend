/**
 * Navigation Component - Modernized
 *
 * Uses React Router v6 NavLink and useAuth hook
 */
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { useAuth } from '@/hooks'
import SearchBar from './SearchBar'

const logo =
  'https://tbncdn.freelogodesign.org/c86624f6-33f7-4d24-a887-26689680d596.png'

export function Nav() {
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <Menu pointing inverted color="grey" size="huge" className="nav">
      <Menu.Item>
        <img src={logo} alt="MarketViz Logo" />
      </Menu.Item>

      {isAuthenticated && user ? (
        <>
          <Menu.Item as={NavLink} to="/dashboard">
            Dashboard
          </Menu.Item>
          <Menu.Item as={NavLink} to="/watchlist">
            Watchlist
          </Menu.Item>
          <Menu.Item as={NavLink} to="/crypto">
            Crypto
          </Menu.Item>

          <Menu.Menu position="right">
            <Menu.Item>
              <SearchBar />
            </Menu.Item>
            <Menu.Item onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu.Menu>
        </>
      ) : (
        <Menu.Item as={NavLink} to="/login">
          Login
        </Menu.Item>
      )}
    </Menu>
  )
}

export default Nav
