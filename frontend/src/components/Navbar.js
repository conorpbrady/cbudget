import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../api/authservice";

class Navbar extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {
    
     const isAuthenticated = this.props.isAuthenticated;

     return (
       <nav>
        <ul>
          <li>
            <Link className={"nav-link"} to={"/"}>Home</Link>
          </li>
          <li>
            { isAuthenticated ? 
              <Link className={"nav-link"} to={"/"} onClick={ logout }>Logout</Link> :
              <Link className={"nav-link"} to={"/login"}>Login</Link>
            }
          </li>
          <li>
            <Link className={"nav-link"} to={"/signup"}>Signup</Link>
          </li>
        </ul>
       </nav>
     );
   }
}

export default Navbar;
