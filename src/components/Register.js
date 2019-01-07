import React, { Component } from 'react';
import Adapter from '../apis/Adapter'
import { Button, Form } from 'semantic-ui-react'

class Register extends Component {
  state = {
    email: "",
    username: "",
    password: ""
  }

  handleChange = event => this.setState({ [event.target.name]: event.target.value })

  handleSubmit = event => {
    event.preventDefault()

    Adapter.newUser(this.state)
      .then(res => {
        if (res.ok) {
          alert("You have successfully registered! Please LOGIN above to verify credentials")
        } else {
          alert("Account already exists. Please LOGIN or REGISTER with different credentials")
        }
      })
      .then(res => this.setState({ email: "", username: "", password: ""}))
  }

  render() {
    return (

        <Form className="register-form" onSubmit={this.handleSubmit} >

          <Form.Input
            type="email"
            name="email"
            label="Email"
            placeholder="123@gmail.com"
            icon='mail' 
            iconPosition='left'
            value={this.state.email}
            onChange={this.handleChange}
          />


          <Form.Input
            type="text"
            name="username"
            label="Username"
            placeholder="Username"
            icon='user'
            iconPosition='left'
            value={this.state.username}
            onChange={this.handleChange}
          />

          <Form.Input
            type="password"
            name="password"
            label="Password"
            icon='lock'
            iconPosition='left'
            value={this.state.password}
            onChange={this.handleChange} />

          <Button content='Sign up' icon='signup' type="submit" value="submit" />
        </Form>
    )
  }
} /// End of Register Class
export default Register
