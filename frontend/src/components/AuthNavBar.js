import React from 'react';
import { NavLink } from 'react-router-dom';
import { matchPath } from 'react-router';

export default function AuthNavBar() {
  return (
    <nav className={'navbar nav-light'} id={'auth-navbar'}>
      <ul className={'nav'}>
        <li className={'nav-item'}>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-link active-style' : 'nav-link'
            }
            to={'/accounts'}
          >
            Accounts
          </NavLink>
        </li>
        <li className={'nav-item'}>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-link active-style' : 'nav-link'
            }
            to={'/categories'}
          >
            Categories
          </NavLink>
        </li>
        <li className={'nav-item'}>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-link active-style' : 'nav-link'
            }
            to={'/transactions'}
          >
            Transactions
          </NavLink>
        </li>
        <li className={'nav-item'}>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-link active-style' : 'nav-link'
            }
            to={'/budget'}
          >
            Budget
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
