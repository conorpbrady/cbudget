import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthLinks() {
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
