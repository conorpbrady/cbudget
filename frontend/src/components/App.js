import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";

class App extends Component {
  render() {
    return (
      <div className="site">
        <main>
          <h1>It's react time!</h1>
          <Routes>
            <Route exact path={"/login/"} component={Login} />
            <Route exact path={"/signup/"} component={Signup} />
            <Route path={"/"} render={() => <div>Home</div>} />
          </Routes>
        </main>
      </div>
    );
  }
}

export default App;
