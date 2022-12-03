import React from 'react';
import { Link } from 'react-router-dom';
import AuthLinks from './AuthLinks';
import UnauthLinks from './UnauthLinks';
import AuthNavBar from './AuthNavBar';

export default function Navbar(props) {
  const isAuthenticated = props.isAuthenticated;

  return (
    <>
      <nav className={'navbar'} id={'navbar-primary'}>
        <Link className={'nav-link navbar-brand'} to={'/'}>
          {'  '}
          cBudget
        </Link>
        {isAuthenticated ? <AuthLinks /> : <UnauthLinks />}
      </nav>
      {isAuthenticated ? <AuthNavBar /> : <></>}
    </>
  );
}
