import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UnauthLinks extends Component {
  render() {
    return (
      <>
        <li>
          <Link className={'nav-link'} to={'/login'}>
            Login
          </Link>
        </li>
        <li>
          <Link className={'nav-link'} to={'/signup'}>
            Signup
          </Link>
        </li>
      </>
    );
  }
}

export default UnauthLinks;
