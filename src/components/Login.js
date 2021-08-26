import React, { useRef, useState } from 'react';
import { Cancel, Room } from '@material-ui/icons';
import axios from 'axios';

const Login = ({ setShowLogin, storage, setCurrentUser }) => {
  const [Success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const email = useRef();
  const password = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const User = {
      email: email.current.value,
      password: password.current.value,
    };
    try {
      if (User.email === '' || User.password === '') {
        setError(true);
      } else {
        const res = await axios.post(
          'http://localhost:5000/api/users/login',
          User
        );
        storage.setItem('user', res.data.username);
        setCurrentUser(res.data.username);
        setShowLogin(false);
        setError(false);
        setSuccess(true);
      }
    } catch (error) {
      setSuccess(false);
      setError(true);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '300px',
        width: '320px',
        padding: '20px',
        borderRadius: '10px',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div>
        <span>
          <Room />
        </span>
        Travel
      </div>
      <form onSubmit={handleSubmit}>
        <input type='email' placeholder='email' ref={email} />
        <input type='password' placeholder='password' ref={password} />
        <button className='btn btn-success'>Login</button>
        {Success && <span className='text-success'>Login Success!</span>}
        {error && <span className='text-danger'>Login failed!</span>}
      </form>
      <Cancel
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          cursor: 'pointer',
        }}
        onClick={(e) => setShowLogin(false)}
      />
    </div>
  );
};

export default Login;
