import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../api/authservice';

export default function AuthLinks() {
  return (
    <ul className={'nav'}>
      <li className={'nav-item'}>
        <Link className={'nav-link'} to={'/profile'}>
          Profile
        </Link>
      </li>
      <li className={'nav-item'}>
        <Link className={'nav-link'} to={'/'} onClick={logout}>
          Logout
        </Link>
      </li>
    </ul>
  );
}
