import React from "react";
import Button from "@mui/material/Button";

const GoogleLoginButton = ({ onClick }) => {
  return (
    <Button variant="contained" color="secondary" onClick={onClick}>
      Login With Google
    </Button>
  );
};

export default GoogleLoginButton;
