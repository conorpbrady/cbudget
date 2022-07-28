import React, { Component } from "react";
import axiosInstance from "../api/axiosApi";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      message: ""
    };

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

    axiosInstance.post('/api/user/create/', {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    })
    .then(response => {
      
      this.setState({ username: "", password: "", email: "" });
      window.location.href = '/login';
    })
    .catch(error => {
      console.log(error);
      const errorMessages = error.response.data.errors;
      let message = ""
      for(let em of errorMessages) {
        message += "[" + em.field + "] " + em.message + " ";
      }
      this.setState({ username: "", password: "", email: "", message: message });
    });
  }


  render() {
    return (
      <div>
      <div className="warning">{ this.state.message }</div>
        <form onSubmit={this.handleSubmit}>
          <label>Username:
            <input name="username" type="text" value={this.state.username} onChange={this.handleChange} />
          </label>
          
          <label>Password:
            <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
          </label>

          <label>Email:
            <input name="email" type="text" value={this.state.email} onChange={this.handleChange} />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default Signup;
