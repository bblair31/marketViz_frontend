import React, { Component } from 'react';
import Adapter from '../apis/Adapter'

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
      <div className="register" style={{display: "inline-block"}}>
        REGISTER
        <form className="register-form" onSubmit={this.handleSubmit} >
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />

          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
          />

          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange} />

          <button type="submit" value="submit">Sign Up</button>
        </form>
      </div>
    )
  }
} /// End of Register Class
export default Register
