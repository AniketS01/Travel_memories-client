import { Explore } from '@material-ui/icons';
import React from 'react';

const Navbar = ({
  currentUser,
  setShowRegister,
  setShowLogin,
  setCurrentUser,
}) => {
  return (
    <div>
      <nav
        className='navbar navbar-dark expand-sm'
        style={{ backgroundColor: '#242B2E', opacity: 0.9 }}
      >
        <h4
          className='navbar-brand m-2'
          style={{ color: 'white', fontSize: '25px' }}
        >
          <span className='s-4'>
            <Explore fontSize='large' />
          </span>
          <i>
            <b>Travel</b>
          </i>
        </h4>
        <ul
          className='nav navbar-nav navbar-right'
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          {currentUser ? (
            <li>
              <button
                type='button'
                className='btn btn-danger p-2'
                style={{ marginRight: '5px' }}
                onClick={(e) => setCurrentUser(null)}
              >
                logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <button
                  type='button'
                  className='btn btn-primary p-2'
                  style={{ marginRight: '5px' }}
                  onClick={(e) => setShowRegister(true)}
                >
                  Register
                </button>
              </li>
              <li>
                <button
                  type='button'
                  className='btn btn-success p-2'
                  style={{ marginRight: '5px' }}
                  onClick={(e) => setShowLogin(true)}
                >
                  Login
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
