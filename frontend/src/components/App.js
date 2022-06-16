import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import loggedIn from "../authservice";

class App extends Component {
  render() {
    let loginLink
    if(loggedIn) {
      console.log("Logged in");
      loginLink = <Link className={"nav-link"} to={"/logout/"}>Logout</Link>
    } else {
      console.log("Not logged in");
      loginLink = <Link className={"nav-link"} to={"/login/"}>Login</Link>
    } 
    return (
      <div className="site">
        <nav>
            <Link className={"nav-link"} to={"/"}>Home</Link>
            {loginLink}
            <Link className={"nav-link"} to={"/signup/"}>Signup</Link>
        </nav>
        <main>
          <h1>It's react time!</h1>
          <Routes>
            <Route exact path={"/login/"} element={<Login/>} />
            <Route exact path={"/signup/"} element={<Signup/>} />
            <Route path={"/"} element={<div>Home</div>} />
          </Routes>
        <p>The user is <b>{loggedIn ? 'currently' : 'not'}</b> logged in</p>
        </main>
      </div>
    );
  }
}

export default App;
