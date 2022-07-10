import React, { Component } from "react";
import axiosInstance from "../axiosApi";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {username: "", password: "", message: ""};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    }

  handleChange(event) {
    this.setState(
      {
        [event.target.name]: event.target.value
      }
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    axiosInstance.post('/api/token/obtain/', {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        const emptyState = {username: '', password: ''};
        this.setState(emptyState);
        
        axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        window.location.href = "/"; 
    })
    .catch(error => {
      this.setState({ username: "", password: "",  message: "Unable to login with those credentials" });
    });
  }

  render() {
    return (
      <div>
        <div className="warning">{ this.state.message }</div>
        <form onSubmit={this.handleSubmit}>
          <label>Username:
            <input name="username" text="text" value={this.state.username} onChange={this.handleChange} />
          </label>

          <label>Password:
            <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
          </label>
      
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default Login;
