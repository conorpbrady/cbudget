import React from 'react';
import { NavLink } from 'react-router-dom';
import { matchPath } from 'react-router';

export default function AuthNavBar() {
  return (
    <nav className={'navbar nav-light'} id={'auth-navbar'}>
      <ul className={'nav nav-tabs'} id={'auth-navbar-tabs'}>
        <li className={'nav-item'}>
          <NavLink
            className={'nav-link'}
            activeClassName={'active'}
            to={'/accounts'}
          >
            Accounts
          </NavLink>
        </li>
        <li className={'nav-item'}>
          <NavLink
            className={'nav-link'}
            activeClassName={'active'}
            to={'/categories'}
          >
            Categories
          </NavLink>
        </li>
        <li className={'nav-item'}>
          <NavLink
            className={'nav-link'}
            activeClassName={'active'}
            to={'/transactions'}
          >
            Transactions
          </NavLink>
        </li>
        <li className={'nav-item'}>
          <NavLink
            className={'nav-link'}
            activeClassName={'active'}
            to={'/budget'}
          >
            Budget
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
