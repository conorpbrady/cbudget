import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";

class App extends Component {
  render() {
    return (
      <div className="site">
        <nav>
          <Link className={"nav-link"} to={"/"}>Home</Link>
          <Link className={"nav-link"} to={"/login/"}>Login</Link>
          <Link className={"nav-link"} to={"/signup/"}>Signup</Link>
        </nav>
        <main>
          <h1>It's react time!</h1>
          <Routes>
            <Route exact path={"/login/"} element={<Login/>} />
            <Route exact path={"/signup/"} element={<Signup/>} />
            <Route path={"/"} element={<div>Home</div>} />
          </Routes>
        </main>
      </div>
    );
  }
}

export default App;
