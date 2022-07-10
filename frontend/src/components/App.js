import React, { Component, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import { authenticate, getUsername, logout } from "../authservice";
import "./App.css"

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        isAuthenticated: false,
        username: null
    };
  }

  componentDidMount() {
    authenticate().then(isAuthenticated => {
      const username = getUsername();
      this.setState({ isAuthenticated, username });
  
    });
  }

  render() {
 
    const isAuthenticated = this.state.isAuthenticated;

    return (
      <div className="site">
        <nav>
            <Link className={"nav-link"} to={"/"}>Home</Link>
            { isAuthenticated
              ? <Link className={"nav-link"} to={"/"} onClick={logout}>Logout</Link>
              : <><Link className={"nav-link"} to={"/login/"}>Login</Link>
                <Link className={"nav-link"} to={"/signup/"}>Signup</Link></>
            }
        </nav>
        <main>
          <h1>It's react time!</h1>
          <Routes>
            <Route exact path={"/login/"} element={<Login/>} />
            <Route exact path={"/signup/"} element={<Signup/>} />
            <Route path={"/"} element={<div>Home</div>} />
          </Routes>
          <p>Hello {this.state.username ? this.state.username : 'anonymous user'}</p>
          <p>The user is <b>{this.state.isAuthenticated ? 'currently' : 'not' }</b> logged in</p>
        </main>
      </div>
    );
  }
}

export default App;
