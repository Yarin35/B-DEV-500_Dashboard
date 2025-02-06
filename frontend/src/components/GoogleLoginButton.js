import React from "react";
import Button from '@mui/material/Button';

const GoogleLoginButton = () => {

  const handleLoginSuccess = async () => {
    try {
      window.location.href = 'http://localhost:3001/auth/google';
    } catch (error) {
      console.error('Error logging in: ', error);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleLoginSuccess}>
        Login with Google
    </Button>
  );
};

export default GoogleLoginButton;
