import React, { Component } from 'react';
import Adapter from '../apis/Adapter'
import { Button, Form } from 'semantic-ui-react'

class Login extends Component {
  state = {
    username: "",
    password: ""
  }

  handleChange = event => this.setState({ [event.target.name]: event.target.value })

  handleSubmit = event => {
    event.preventDefault()
    Adapter.login(this.state)
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          alert("Invalid login")
        }
      })
      .then(res => res ? this.props.successfulLogin(res) : null)
      .then(res => this.setState({ username: "", password: ""}))
  }

  render() {
    return (
      <Form className="login-form" onSubmit={this.handleSubmit} >
        <Form.Input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.handleChange}
          icon='user'
          iconPosition='left'
          label='Username'
          placeholder='Username'
        />

        <Form.Input
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
          icon='lock'
          iconPosition='left'
          label='Password'
          type='password' />

        <Button content='Login' type="submit" value="submit" primary/>
      </Form>
    )
  }
} /// End of Login Class
export default Login
