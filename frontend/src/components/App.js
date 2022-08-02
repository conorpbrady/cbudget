import React, { Component, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Accounts from "./Accounts";
import Categories from "./Categories";
import { authenticate, getUser, logout } from "../api/authservice";
import "./App.css"

const Profile = () => <h1>Profile</h1>;
const Transactions = () => <h1>Transactions</h1>;
const Budget = () => <h1>Budget</h1>;

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
            <Route exact path={"/profile/"} element={<Profile />} />
            <Route exact path={"/accounts/"} element={<Accounts />} />
            <Route exact path={"/budget/"} element={<Budget />} />
            <Route exact path={"/categories/"} element={<Categories />} />
            <Route exact path={"/transactions/"} element={<Transactions />} />
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
