import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthLinks from './AuthLinks';
import UnauthLinks from './UnauthLinks';

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
            <Link className={'nav-link'} to={'/'}>
              Home
            </Link>
          </li>
          {isAuthenticated ? <AuthLinks /> : <UnauthLinks />}
        </ul>
      </nav>
    );
  }
}

export default Navbar;
