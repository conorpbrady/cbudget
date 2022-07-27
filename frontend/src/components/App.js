import React, { Component, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Navbar from "./Navbar";
import { authenticate, getUser, logout } from "../authservice";
import "./App.css"

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        isAuthenticated: false,
        user: {} 
    };
  }

  componentDidMount() {
    authenticate().then(isAuthenticated => {
      const user = getUser();
      console.log(user);
      this.setState({ isAuthenticated, user });
  
    });
  }

  render() {
 
    const user = this.state.user;

    const isAuthenticated = this.state.isAuthenticated;
    
    return (
      <div className="site">
      <Navbar isAuthenticated={ isAuthenticated } />  
      <main>
          <h1>It's react time!</h1>
          <Routes>
            <Route exact path={"/login/"} element={<Login/>} />
            <Route exact path={"/signup/"} element={<Signup/>} />
            <Route path={"/"} element={<div>Home</div>} />
          </Routes>
          <p>Hello {user.username ? user.username : 'anonymous user'}</p>
          <p>The user is <b>{isAuthenticated ? 'currently' : 'not' }</b> logged in</p>
        </main>
      </div>
    );
  }
}

export default App;
