import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassDollar } from '@fortawesome/free-solid-svg-icons';
import AuthLinks from './AuthLinks';
import UnauthLinks from './UnauthLinks';
import AuthNavBar from './AuthNavBar';

export default function Navbar(props) {
  const isAuthenticated = props.isAuthenticated;

  return (
    <>
      <nav className={'navbar'}>
        <Link className={'nav-link navbar-brand'} to={'/'}>
          <FontAwesomeIcon icon={faMagnifyingGlassDollar} />
          {'  '}
          cBudget
        </Link>
        {isAuthenticated ? <AuthLinks /> : <UnauthLinks />}
      </nav>
      {isAuthenticated ? <AuthNavBar /> : <></>}
    </>
  );
}
