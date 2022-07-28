import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logout } from "../api/authservice";

class AuthLinks extends Component {

  render() {
    return (
      <>
      <li>
        <Link className={"nav-link"} to={"/accounts"}>Accounts</Link>
      </li>
      <li>
        <Link className={"nav-link"} to={"/transactions"}>Transactions</Link>
      </li>
      <li>
        <Link className={"nav-link"} to={"/budget"}>Budget</Link>
      </li>
      <li>
        <Link className={"nav-link"} to={"/profile"}>Profile</Link>
      </li>
      <li>
        <Link className={"nav-link"} to={"/"} onClick={ logout }>Logout</Link>
      </li>
      </>
  );
  }
}

export default AuthLinks;
