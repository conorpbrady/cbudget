import React from 'react';
import { Link } from 'react-router-dom';
import AuthLinks from './AuthLinks';
import UnauthLinks from './UnauthLinks';

export default function Navbar(props) {
  const isAuthenticated = props.isAuthenticated;

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
