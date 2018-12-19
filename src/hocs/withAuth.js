import React from 'react'
import { Redirect } from 'react-router'
import { fetchCurrentUser } from '../apis/Adapter'
import { Loader } from 'semantic-ui-react'


const withAuth = (WrappedComponent) => {
  return class AuthorizedComponent extends React.Component {
    debugger
    componentDidMount() {
      if (localStorage.getItem('jwt') && !this.props.user) this.props.fetchCurrentUser()
    }

    render() {
      if (localStorage.getItem('jwt') && this.props.user) {
        return <WrappedComponent />
      } else if (localStorage.getItem('jwt') && (this.props.authenticatingUser || !this.props.loggedIn)) {
        return <Loader active inline="centered" />
      } else {
        return <Redirect to="/login" />
      }
    }
  }
}
export default withAuth
