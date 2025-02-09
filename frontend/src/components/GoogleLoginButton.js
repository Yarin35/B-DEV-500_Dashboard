import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (response) => {
    const token = response.credential;
    // Send the token to your backend to verify and create a session
    fetch('http://localhost:3001/auth/google/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        navigate('/home');
      })
      .catch((error) => {
        console.error('Error logging in: ', error);
      });
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed: ', error);
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={handleLoginFailure}
      useOneTap={false}
    />
  );
};

export default GoogleLoginButton;
