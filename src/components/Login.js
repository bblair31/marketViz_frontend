import React, { Component } from 'react';
import Adapter from '../apis/Adapter'

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
      .then(res => this.props.successfulLogin(res))
      .then(res => this.setState({ username: "", password: ""}))
  }

  render() {
    return (
      <div className="login" style={{display: "inline-block"}}>
        LOGIN
        <form className="login-form" onSubmit={this.handleSubmit} >
          <label>Username: </label>
          <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />

          <label>Password: </label>
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />

          <button type="submit" value="submit">Login</button>
        </form>
      </div>
    )
  }
} /// End of Login Class
export default Login
