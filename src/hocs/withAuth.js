import React from 'react'
import { Redirect } from 'react-router'
import { Loader } from 'semantic-ui-react'

const withAuth = (WrappedComponent) => {
  class AuthorizedComponent extends React.Component {
    // componentDidMount() {
    //   if (localStorage.getItem('jwt') && localStorage.getItem('user')) {
    //     console.log("in componentDidMount")
    //   }
    // }
    render() {
      if (localStorage.getItem('jwt') && localStorage.getItem('user')) {
        return (
          <WrappedComponent {...this.props} />
        )
      } else if (localStorage.getItem('jwt') && (this.props.authenticatingUser || !this.props.loggedIn)) {
        return <Loader active inline="centered" />
      } else {
        return <Redirect to="/login" />
      }
    }
  }
}
export default withAuth
